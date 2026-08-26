import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaShoppingBag,
    FaHeart,
    FaStar,
    FaTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    getCart,
} from "../../features/cart/cartApi";

import { setCart } from "../../features/cart/cartSlice";

import {
    addToWishlist,
    removeWishlistItem,
    getWishlist,
} from "../../features/wishlist/wishlistApi";

import { setWishlist } from "../../features/wishlist/wishlistSlice";


export default function ProductCard({ product }) {

    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const { wishlist = [] } = useSelector(
        (state) => state.wishlist
    );




    const images = useMemo(() => {

        if (!Array.isArray(product?.images)) {
            return [];
        }

        return product.images.filter(
            (image) => image?.url
        );

    }, [product?.images]);


    const isWishlisted = wishlist.some(
        (item) =>
            item?._id?.toString() ===
            product?._id?.toString()
    );


    const [currentImage, setCurrentImage] = useState(0);

    const [isHovering, setIsHovering] = useState(false);

    const [showSizeModal, setShowSizeModal] =
        useState(false);

    const [selectedSize, setSelectedSize] =
        useState(null);

    const [addingToCart, setAddingToCart] =
        useState(false);




    const getProductSizes = () => {

        let sizes = product?.sizes || [];

        if (
            Array.isArray(sizes) &&
            sizes.length === 1 &&
            typeof sizes[0] === "string"
        ) {

            try {
                sizes = JSON.parse(sizes[0]);
            } catch (error) {

                console.error(
                    "Invalid product sizes:",
                    error
                );

                sizes = [];
            }
        }

        if (!Array.isArray(sizes)) {
            return [];
        }

        return sizes
            .map((item) => {

                if (
                    item === null ||
                    item === undefined
                ) {
                    return null;
                }

                if (typeof item === "object") {

                    return {
                        size: item.size,
                        stock: Number(item.stock || 0),
                    };
                }

                return null;
            })
            .filter(Boolean);
    };


    const productSizes = useMemo(
        () => getProductSizes(),
        [product?.sizes]
    );


    const hasSizes = productSizes.length > 0;

    const hasAvailableSize =
        productSizes.some(
            (item) => Number(item.stock) > 0
        );


    const isOutOfStock = hasSizes
        ? !hasAvailableSize
        : Number(product?.stock || 0) <= 0;




    const discount = Number(
        product?.discount || 0
    );

    const originalPrice = Number(
        product?.price || 0
    );

    const finalPrice =
        originalPrice -
        (originalPrice * discount) / 100;




    const currentImageData =
        images[currentImage] || null;

    const nextImageIndex =
        images.length > 1
            ? (currentImage + 1) % images.length
            : currentImage;

    const nextImageData =
        images[nextImageIndex] || null;


    useEffect(() => {

        if (currentImage >= images.length) {
            setCurrentImage(0);
        }

    }, [currentImage, images.length]);



    useEffect(() => {

        if (
            !isHovering ||
            !nextImageData?.url
        ) {
            return;
        }

        const image = new Image();

        image.src = nextImageData.url;

    }, [
        isHovering,
        nextImageData?.url,
    ]);


    useEffect(() => {

        if (
            !isHovering ||
            images.length <= 1
        ) {
            return undefined;
        }

        const interval = setInterval(() => {

            setCurrentImage((previous) => {

                if (
                    previous >=
                    images.length - 1
                ) {
                    return 0;
                }

                return previous + 1;
            });

        }, 1500);

        return () => {
            clearInterval(interval);
        };

    }, [
        isHovering,
        images.length,
    ]);


    const handleMouseEnter = () => {

        if (images.length > 1) {
            setIsHovering(true);
        }
    };


    const handleMouseLeave = () => {
        setIsHovering(false);
    };


    /* =========================================================
       SIZE MODAL
    ========================================================= */

    const closeSizeModal = () => {

        if (addingToCart) {
            return;
        }

        setShowSizeModal(false);
        setSelectedSize(null);
    };


    /* =========================================================
       ADD TO CART
    ========================================================= */

    const handleAddToCart = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (addingToCart) {
            return;
        }

        if (!isAuthenticated) {

            toast.error(
                "Please login first"
            );

            return;
        }

        if (isOutOfStock) {

            toast.error(
                "Product is out of stock"
            );

            return;
        }

        if (hasSizes) {

            setSelectedSize(null);
            setShowSizeModal(true);

            return;
        }


        try {

            setAddingToCart(true);

            await addToCart(
                product._id,
                1,
                null
            );


            const { data } =
                await getCart();


            dispatch(
                setCart(data.cart)
            );


            toast.success(
                "Product added to cart"
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "Please login first"
                );

                return;
            }


            toast.error(
                error.response?.data?.message ||
                "Unable to add product"
            );

        } finally {

            setAddingToCart(false);
        }
    };


    /* =========================================================
       SIZE ADD TO CART
    ========================================================= */

    const handleSizeAddToCart =
        async () => {

            if (addingToCart) {
                return;
            }

            if (!selectedSize) {

                toast.error(
                    "Please select a size"
                );

                return;
            }


            const selectedSizeData =
                productSizes.find(
                    (item) =>
                        String(item.size) ===
                        String(selectedSize)
                );


            if (!selectedSizeData) {

                toast.error(
                    "Selected size is unavailable"
                );

                return;
            }


            if (
                Number(
                    selectedSizeData.stock
                ) <= 0
            ) {

                toast.error(
                    "Selected size is out of stock"
                );

                return;
            }


            try {

                setAddingToCart(true);


                await addToCart(
                    product._id,
                    1,
                    selectedSize
                );


                const { data } =
                    await getCart();


                dispatch(
                    setCart(data.cart)
                );


                setShowSizeModal(false);
                setSelectedSize(null);


                toast.success(
                    "Product added to cart"
                );

            } catch (error) {

                console.error(
                    "Size cart error:",
                    error
                );


                if (
                    error.response?.status === 401
                ) {

                    toast.error(
                        "Please login first"
                    );

                    return;
                }


                toast.error(
                    error.response?.data?.message ||
                    "Unable to add product"
                );

            } finally {

                setAddingToCart(false);
            }
        };


    /* =========================================================
       WISHLIST
    ========================================================= */

    const handleWishlist = async (e) => {

        e.preventDefault();
        e.stopPropagation();


        if (!isAuthenticated) {

            toast.error(
                "Please login first"
            );

            return;
        }


        try {

            if (isWishlisted) {

                await removeWishlistItem(
                    product._id
                );

                toast.success(
                    "Removed from wishlist"
                );

            } else {

                await addToWishlist(
                    product._id
                );

                toast.success(
                    "Added to wishlist"
                );
            }


            const { data } =
                await getWishlist();


            dispatch(
                setWishlist(
                    data.wishlist?.products || []
                )
            );

        } catch (error) {

            console.error(
                "Wishlist update error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Wishlist update failed"
            );
        }
    };


    const sliderPosition =
        currentImage * 100;


    /* =========================================================
       CARD
    ========================================================= */

    return (
        <>
            <Link
                to={`/products/${product.slug}`}
                className="luxury-product-card"
                onMouseEnter={
                    handleMouseEnter
                }
                onMouseLeave={
                    handleMouseLeave
                }
            >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="luxury-product-image">

                    {/* EDITORIAL NUMBER */}

                    <span className="luxury-product-index">
                        {String(
                            product?.position ||
                            currentImage + 1
                        ).padStart(2, "0")}
                    </span>


                    {/* DISCOUNT */}

                    {discount > 0 && (
                        <span className="luxury-discount">
                            -{discount}%
                        </span>
                    )}


                    {/* FEATURED */}

                    {product.featured && (
                        <span className="luxury-featured">
                            BESTSELLER
                        </span>
                    )}


                    {/* WISHLIST */}

                    <button
                        type="button"
                        className={`luxury-wishlist ${
                            isWishlisted
                                ? "active"
                                : ""
                        }`}
                        onClick={
                            handleWishlist
                        }
                        aria-label={
                            isWishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                    >
                        <FaHeart />
                    </button>


                    {/* IMAGE */}

                    <div className="luxury-image-viewport">

                        {currentImageData ? (

                            <div
                                className="luxury-image-track"
                                style={{
                                    transform:
                                        `translateX(-${sliderPosition}%)`,
                                }}
                            >

                                <div className="luxury-image-slide">

                                    <img
                                        src={
                                            currentImageData.url
                                        }
                                        alt={
                                            `${product.name} 1`
                                        }
                                        className={
                                            isOutOfStock
                                                ? "luxury-disabled-image"
                                                : ""
                                        }
                                        loading="lazy"
                                        decoding="async"
                                    />

                                </div>


                                {nextImageData &&
                                    images.length > 1 && (

                                        <div
                                            className="luxury-image-slide"
                                            aria-hidden="true"
                                        >

                                            <img
                                                src={
                                                    nextImageData.url
                                                }
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />

                                        </div>
                                    )}

                            </div>

                        ) : (

                            <div className="luxury-no-image">
                                <span>
                                    No Image
                                </span>
                            </div>
                        )}

                    </div>


                    {/* OUT OF STOCK */}

                    {isOutOfStock && (
                        <div className="luxury-stock-overlay">

                            <span>
                                SOLD OUT
                            </span>

                        </div>
                    )}


                    {/* IMAGE INDICATORS */}

                    {images.length > 1 && (

                        <div className="luxury-image-indicators">

                            {images.map(
                                (image, index) => (

                                    <span
                                        key={
                                            image._id ||
                                            image.public_id ||
                                            image.url ||
                                            index
                                        }
                                        className={
                                            currentImage === index
                                                ? "active"
                                                : ""
                                        }
                                    />

                                )
                            )}

                        </div>
                    )}

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="luxury-product-content">


                    {/* RATING */}

                    <div className="luxury-rating">

                        <div className="luxury-stars">

                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />

                        </div>

                        <span>
                            {product.averageRating
                                ? Number(
                                    product.averageRating
                                ).toFixed(1)
                                : "4.8"}
                        </span>

                    </div>


                    {/* CATEGORY */}

                    <span className="luxury-category">

                        {product.category?.name ||
                            "Collection"}

                    </span>


                    {/* NAME */}

                    <h3 className="luxury-product-name">
                        {product.name}
                    </h3>


                    {/* PRICE */}

                    <div className="luxury-price">

                        <span className="luxury-current-price">
                            ₹{finalPrice.toFixed(0)}
                        </span>


                        {discount > 0 && (

                            <span className="luxury-original-price">
                                ₹{originalPrice.toFixed(0)}
                            </span>

                        )}

                    </div>


                    {/* BOTTOM ROW */}

                    <div className="luxury-product-bottom">

                        {!isOutOfStock ? (

                            <span className="luxury-stock in">
                                In Stock
                            </span>

                        ) : (

                            <span className="luxury-stock out">
                                Out of Stock
                            </span>

                        )}


                        <button
                            type="button"
                            className={`luxury-cart-button ${
                                isOutOfStock
                                    ? "disabled"
                                    : ""
                            }`}
                            disabled={
                                isOutOfStock ||
                                addingToCart
                            }
                            onClick={
                                handleAddToCart
                            }
                        >

                            <FaShoppingBag />

                            <span>
                                {isOutOfStock
                                    ? "Sold Out"
                                    : addingToCart
                                        ? "Adding..."
                                        : "Add to Cart"}
                            </span>

                        </button>

                    </div>

                </div>

            </Link>


            {/* =====================================================
                SIZE MODAL
            ===================================================== */}

            {showSizeModal && (

                <div
                    className="luxury-size-overlay"
                    onClick={
                        closeSizeModal
                    }
                >

                    <div
                        className="luxury-size-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="luxury-size-close"
                            onClick={
                                closeSizeModal
                            }
                            disabled={
                                addingToCart
                            }
                        >
                            <FaTimes />
                        </button>


                        <div className="luxury-size-heading">

                            <span>
                                COLLECTION / SIZE
                            </span>

                            <h2>
                                Choose Your Size
                            </h2>

                            <p>
                                Select your preferred
                                size before adding
                                this piece to your cart.
                            </p>

                        </div>


                        {/* PRODUCT PREVIEW */}

                        <div className="luxury-size-preview">

                            <div className="luxury-size-preview-image">

                                {images[0]?.url && (

                                    <img
                                        src={
                                            images[0].url
                                        }
                                        alt={
                                            product.name
                                        }
                                        loading="lazy"
                                        decoding="async"
                                    />

                                )}

                            </div>


                            <div className="luxury-size-preview-content">

                                <span>
                                    {product.category?.name ||
                                        "Collection"}
                                </span>

                                <h4>
                                    {product.name}
                                </h4>

                                <strong>
                                    ₹{finalPrice.toFixed(0)}
                                </strong>

                            </div>

                        </div>


                        {/* SIZE HEADER */}

                        <div className="luxury-size-selection-header">

                            <div>
                                <strong>
                                    Select Size
                                </strong>

                                <span>
                                    Required
                                </span>
                            </div>

                            {selectedSize && (
                                <small>
                                    Selected: {selectedSize}
                                </small>
                            )}

                        </div>


                        {/* SIZE OPTIONS */}

                        <div className="luxury-size-options">

                            {productSizes.map(
                                (item, index) => {

                                    const size =
                                        item.size;

                                    const stock =
                                        Number(
                                            item.stock || 0
                                        );

                                    const available =
                                        stock > 0;

                                    const selected =
                                        String(
                                            selectedSize
                                        ) ===
                                        String(size);


                                    return (
                                        <button
                                            key={`${size}-${index}`}
                                            type="button"
                                            disabled={
                                                !available ||
                                                addingToCart
                                            }
                                            className={`
                                                luxury-size-option
                                                ${
                                                    selected
                                                        ? "selected"
                                                        : ""
                                                }
                                                ${
                                                    !available
                                                        ? "unavailable"
                                                        : ""
                                                }
                                            `}
                                            onClick={() => {

                                                if (
                                                    available
                                                ) {
                                                    setSelectedSize(
                                                        size
                                                    );
                                                }

                                            }}
                                        >

                                            <span>
                                                {size}
                                            </span>

                                            {!available && (
                                                <small>
                                                    Sold Out
                                                </small>
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>


                        {/* SELECTED */}

                        {selectedSize && (

                            <div className="luxury-selected-size">

                                <span>
                                    Selected Size
                                </span>

                                <strong>
                                    {selectedSize}
                                </strong>

                            </div>

                        )}


                        {/* ADD */}

                        <button
                            type="button"
                            className="luxury-size-add"
                            disabled={
                                !selectedSize ||
                                addingToCart
                            }
                            onClick={
                                handleSizeAddToCart
                            }
                        >

                            <FaShoppingBag />

                            <span>
                                {addingToCart
                                    ? "Adding..."
                                    : selectedSize
                                        ? "Add to Cart"
                                        : "Select a Size"}
                            </span>

                        </button>


                        <button
                            type="button"
                            className="luxury-size-continue"
                            onClick={
                                closeSizeModal
                            }
                            disabled={
                                addingToCart
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>
            )}

        </>
    );
}