import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMinus, FaPlus, FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { getProduct, getRelatedProducts } from "../features/product/productApi";

import { addToCart, getCart, } from "../features/cart/cartApi";

import { setCart } from "../features/cart/cartSlice";

import { addToWishlist, removeWishlistItem, getWishlist, } from "../features/wishlist/wishlistApi";

import { setWishlist } from "../features/wishlist/wishlistSlice";

import ProductCard from "../Components/Product/ProductCard";

import ReviewForm from "../Components/Reviews/ReviewForm";
import ReviewList from "../Components/Reviews/ReviewList";

const ProductDetails = () => {
    const { id } = useParams();

    const dispatch = useDispatch();

    const wishlist = useSelector(
        (state) => state.wishlist.wishlist
    );

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const availableStock = selectedSize
        ? Number(
            product?.sizes?.find(
                (item) =>
                    Number(item.size) === Number(selectedSize)
            )?.stock || 0
        )
        : Number(product?.stock || 0);

    const [reviewRefresh, setReviewRefresh] = useState(false);

    const handleReviewAdded = () => {
        setReviewRefresh((prev) => !prev);
    };

    useEffect(() => {
        fetchProduct();

        if (localStorage.getItem("token")) {
            loadWishlist();
        }

    }, [id]);



    const fetchProduct = async () => {
        try {
            setLoading(true);

            const { data } = await getProduct(id);


            const productData = data.product;

            let productSizes = productData.sizes || [];

            if (
                Array.isArray(productSizes) &&
                productSizes.length === 1 &&
                typeof productSizes[0] === "string"
            ) {
                try {
                    productSizes = JSON.parse(productSizes[0]);
                } catch (error) {
                    console.error("Invalid sizes:", error);
                    productSizes = [];
                }
            }

            productData.sizes = Array.isArray(productSizes)
                ? productSizes.map((item) => ({
                    size: Number(item.size),
                    stock: Number(item.stock || 0),
                }))
                : [];

            setProduct(productData);

            fetchRelatedProducts(
                data.product.category._id,
                data.product._id
            );
            setSelectedImage(0);
            setQuantity(1);
            setSelectedSize(null);

        } catch (error) {
            console.log(error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };


    const fetchRelatedProducts = async (categoryId, productId) => {
        try {
            const { data } = await getRelatedProducts(categoryId, productId);


            if (data.success) {
                setRelatedProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    };





    const loadWishlist = async () => {
        try {
            const { data } = await getWishlist();

            dispatch(
                setWishlist(data.wishlist?.products || [])
            );
        } catch (error) {
            console.log(error);
        }
    };


    const isWishlisted =
        wishlist?.some(
            (item) => item._id === product?._id
        ) || false;



    const increaseQty = () => {
        if (quantity < availableStock) {
            setQuantity((prev) => prev + 1);
        }
    };



    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };



    const handleAddToCart = async () => {
        try {

            // Product has sizes → size is mandatory
            if (
                product?.sizes?.length > 0 &&
                selectedSize === null
            ) {
                toast.error("Please select a size");
                return;
            }

            const selectedSizeData = product?.sizes?.find(
                (item) =>
                    Number(item.size) === Number(selectedSize)
            );

            // Selected size out of stock
            if (
                selectedSizeData &&
                Number(selectedSizeData.stock) <= 0
            ) {
                toast.error("Selected size is out of stock");
                return;
            }

            // Quantity greater than selected-size stock
            if (
                selectedSizeData &&
                quantity > Number(selectedSizeData.stock)
            ) {
                toast.error(
                    `Only ${selectedSizeData.stock} item(s) available in this size`
                );
                return;
            }

            await addToCart(
                product._id,
                quantity,
                selectedSize
            );

            const { data } = await getCart();

            dispatch(setCart(data.cart));

            toast.success("Product added to cart");

        } catch (error) {

            if (error.response?.status === 401) {
                toast.error("Please login first");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Unable to add product"
            );
        }
    };




    const handleWishlist = async () => {
        try {

            if (isWishlisted) {

                await removeWishlistItem(product._id);

                toast.success("Removed from wishlist");

            } else {

                await addToWishlist(product._id);

                toast.success("Added to wishlist");

            }

            const { data } = await getWishlist();

            dispatch(
                setWishlist(data.wishlist?.products || [])
            );

        } catch (error) {

            if (error.response?.status === 401) {
                toast.error("Please login first");
                return;
            }

            toast.error(
                error.response?.data?.message ||
                "Wishlist failed"
            );
        }
    };





    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-page">
                    <h2>Loading...</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="loading-page">
                    <h2>Product not found</h2>
                </div>
                <Footer />
            </>
        );

    }

    const discount = Number(product.discount || 0);

    const finalPrice =
        product.price - (product.price * discount) / 100;

    return (
        <>
            <Navbar />

            <section className="product-details">

                <div className="product-container">

                    {/* LEFT */}

                    <div className="gallery-section">

                        {product.images?.length > 1 && (

                            <div className="thumbnail-list">

                                {product.images.map((image, index) => (

                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={product.name}
                                        className={`thumbnail ${selectedImage === index
                                            ? "active-thumbnail"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedImage(index)
                                        }
                                    />

                                ))}

                            </div>

                        )}

                        <div className="main-image-box">

                            <img
                                src={
                                    product.images?.[selectedImage]?.url ||
                                    "https://via.placeholder.com/600x700"
                                }
                                alt={product.name}
                                className="main-image"
                            />

                        </div>

                    </div>

                    <div className="info-section">

                        <span className="product-category">
                            {product.category?.name}
                        </span>

                        <h1>{product.name}</h1>

                        <div className="rating-row">

                            {[1, 2, 3, 4, 5].map((star) =>
                                star <= Math.round(product.averageRating || 0) ? (
                                    <FaStar
                                        key={star}
                                        color="#d4af37"
                                    />
                                ) : (
                                    <FaRegStar
                                        key={star}
                                        color="#d4af37"
                                    />
                                )
                            )}

                            <span className="rating-text">
                                {product.averageRating || 0}
                                {" "}
                                ({product.totalReviews || 0} Reviews)
                            </span>

                        </div>

                        <div className="price-wrapper">

                            {discount > 0 && (
                                <span className="old-price">
                                    ₹{product.price}
                                </span>
                            )}

                            <span className="new-price">
                                ₹{finalPrice.toFixed(0)}
                            </span>

                            {discount > 0 && (
                                <span
                                    className="discount-badge-details"
                                    style={{
                                        marginLeft: "12px",
                                        background: "#dc3545",
                                        color: "#fff",
                                        padding: "4px 10px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                    }}
                                >
                                    {discount}% OFF
                                </span>
                            )}

                        </div>

                        <p className="description">
                            {product.description}
                        </p>

                        <div className="product-meta">

                            <div>
                                <strong>Category</strong>

                                <span>
                                    {product.category?.name}
                                </span>
                            </div>

                            <div>
                                <strong>SKU</strong>

                                <span>
                                    {product.sku || "N/A"}
                                </span>
                            </div>

                            <div>

                                <strong>Availability</strong>

                                {product.stock > 0 ? (
                                    <span className="in-stock">
                                        In Stock ({product.stock})
                                    </span>
                                ) : (
                                    <span className="out-stock">
                                        Out of Stock
                                    </span>
                                )}

                            </div>

                        </div>

                        {product.colors?.length > 0 && (

                            <>

                                <h4 className="section-title">
                                    Available Colors
                                </h4>

                                <div className="color-list">

                                    {product.colors.map((color, index) => (

                                        <span
                                            key={index}
                                            className="color-item"
                                        >
                                            {color}
                                        </span>

                                    ))}

                                </div>

                            </>

                        )}




                        {product?.sizes?.length > 0 && (
                            <div className="size-section">

                                <h4 className="section-title">
                                    Select Size
                                </h4>

                                <div className="size-options">

                                    {product.sizes.map((item, index) => {

                                        const size = Number(item.size);
                                        const stock = Number(item.stock || 0);

                                        const isOutOfStock = stock <= 0;

                                        const isSelected =
                                            Number(selectedSize) === size;

                                        return (
                                            <button
                                                key={`${size}-${index}`}
                                                type="button"
                                                className={`size-option ${isSelected ? "selected" : ""
                                                    } ${isOutOfStock
                                                        ? "out-of-stock"
                                                        : ""
                                                    }`}
                                                disabled={isOutOfStock}
                                                onClick={() => {

                                                    if (isOutOfStock) return;

                                                    setSelectedSize(size);

                                                    // If current quantity is greater
                                                    // than new size stock, reduce it.
                                                    setQuantity((currentQuantity) =>
                                                        currentQuantity > stock
                                                            ? stock
                                                            : currentQuantity
                                                    );
                                                }}
                                            >

                                                <span className="size-number">
                                                    {size}
                                                </span>

                                                <span className="size-stock">
                                                    {isOutOfStock
                                                        ? "Out of Stock"
                                                        : `${stock} left`}
                                                </span>

                                            </button>
                                        );
                                    })}

                                </div>

                            </div>
                        )}

                        <div className="quantity-box">

                            <button
                                onClick={decreaseQty}
                            >
                                <FaMinus />
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                onClick={increaseQty}
                            >
                                <FaPlus />
                            </button>

                        </div>

                        <div className="action-buttons">

                            <button
                                className="cart-btn"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>

                            <button
                                className="wishlist-btn-details"
                                onClick={handleWishlist}
                            >
                                {isWishlisted ? (
                                    <>
                                        <FaHeart />
                                        <span>Wishlisted</span>
                                    </>
                                ) : (
                                    <>
                                        <FaRegHeart />
                                        <span>Add to Wishlist</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="extra-info">

                            <div>
                                🚚 Free Delivery on all orders
                            </div>

                            <div>
                                ↩ 7 Days Easy Return
                            </div>

                            <div>
                                🔒 100% Secure Checkout
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Related Products */}

            <section className="related-products">

                <div className="container">

                    <h2>You May Also Like</h2>

                    {relatedProducts.length > 0 ? (

                        <div className="row g-4">

                            {relatedProducts.map((item) => (

                                <div
                                    className="col-lg-3 col-md-6"
                                    key={item._id}
                                >
                                    <ProductCard
                                        product={item}
                                    />
                                </div>

                            ))}

                        </div>

                    ) : (

                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "20px",
                            }}
                        >
                            No related products available.
                        </p>

                    )}

                </div>

            </section>

            <div className="reviews-wrapper">



                <ReviewList
                    productId={product._id}
                    refresh={reviewRefresh}
                />

            </div>

            <Footer />

        </>

    );

};

export default ProductDetails;