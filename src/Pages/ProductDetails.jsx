import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaMinus, FaPlus, FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import {
    getProduct,
    getRelatedProducts,
} from "../features/product/productApi";

import {
    addToCart,
    getCart,
} from "../features/cart/cartApi";

import { setCart } from "../features/cart/cartSlice";

import {
    addToWishlist,
    removeWishlistItem,
    getWishlist,
} from "../features/wishlist/wishlistApi";

import { setWishlist } from "../features/wishlist/wishlistSlice";

import ProductCard from "../Components/Product/ProductCard";

import ReviewList from "../Components/Reviews/ReviewList";

const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://www.soukfashionhouse.com";

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

    const [reviewRefresh, setReviewRefresh] = useState(false);

    const availableStock = selectedSize
        ? Number(
              product?.sizes?.find(
                  (item) =>
                      Number(item.size) ===
                      Number(selectedSize)
              )?.stock || 0
          )
        : Number(product?.stock || 0);

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
                    console.error(
                        "Invalid sizes:",
                        error
                    );

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
                data.product.category?._id,
                data.product._id
            );

            setSelectedImage(0);
            setQuantity(1);
            setSelectedSize(null);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to load product"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async (
        categoryId,
        productId
    ) => {
        if (!categoryId || !productId) {
            return;
        }

        try {
            const { data } =
                await getRelatedProducts(
                    categoryId,
                    productId
                );

            if (data.success) {
                setRelatedProducts(
                    data.products || []
                );
            }
        } catch (error) {
            console.error(
                "Error fetching related products:",
                error
            );
        }
    };

    const loadWishlist = async () => {
        try {
            const { data } = await getWishlist();

            dispatch(
                setWishlist(
                    data.wishlist?.products || []
                )
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
            if (
                product?.sizes?.length > 0 &&
                selectedSize === null
            ) {
                toast.error("Please select a size");
                return;
            }

            const selectedSizeData =
                product?.sizes?.find(
                    (item) =>
                        Number(item.size) ===
                        Number(selectedSize)
                );

            if (
                selectedSizeData &&
                Number(selectedSizeData.stock) <= 0
            ) {
                toast.error(
                    "Selected size is out of stock"
                );

                return;
            }

            if (
                selectedSizeData &&
                quantity >
                    Number(selectedSizeData.stock)
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

            toast.success(
                "Product added to cart"
            );
        } catch (error) {
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
        }
    };

    const handleWishlist = async () => {
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
                <Helmet>
                    <title>
                        Product Not Found | Souk Fashion House
                    </title>

                    <meta
                        name="robots"
                        content="noindex, nofollow"
                    />
                </Helmet>

                <Navbar />

                <div className="loading-page">
                    <h2>
                        Product not found
                    </h2>
                </div>

                <Footer />
            </>
        );
    }

    const discount =
        Number(product.discount || 0);

    const finalPrice =
        product.price -
        (product.price * discount) / 100;

    const productImage =
        product.images?.[0]?.url ||
        `${SITE_URL}/logo.jpg`;

    const productUrl =
        `${SITE_URL}/products/${
            product.slug || product._id
        }`;

    const productDescription =
        product.description
            ?.replace(/<[^>]*>/g, "")
            ?.replace(/\s+/g, " ")
            ?.trim()
            ?.slice(0, 160) ||
        `Shop ${product.name} at Souk Fashion House.`;

    const availability =
        Number(product.stock || 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock";

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",

        name: product.name,

        description:
            product.description ||
            `Shop ${product.name} at Souk Fashion House.`,

        image:
            product.images
                ?.map((image) => image.url)
                .filter(Boolean) || [productImage],

        sku: product.sku || undefined,

        brand: {
            "@type": "Brand",
            name:
                product.brand ||
                "Souk Fashion House",
        },

        category:
            product.category?.name || undefined,

        url: productUrl,

        offers: {
            "@type": "Offer",

            url: productUrl,

            priceCurrency: "INR",

            price: Number(
                finalPrice
            ).toFixed(2),

            availability,

            itemCondition:
                "https://schema.org/NewCondition",

            seller: {
                "@type": "Organization",
                name: "Souk Fashion House",
            },
        },

        ...(Number(product.totalReviews || 0) >
            0 &&
        Number(product.averageRating || 0) > 0
            ? {
                  aggregateRating: {
                      "@type": "AggregateRating",

                      ratingValue:
                          Number(
                              product.averageRating
                          ).toFixed(1),

                      reviewCount:
                          Number(
                              product.totalReviews
                          ),
                  },
              }
            : {}),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",

        "@type": "BreadcrumbList",

        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },

            {
                "@type": "ListItem",
                position: 2,
                name: "Shop",
                item: `${SITE_URL}/shop`,
            },

            ...(product.category?.name
                ? [
                      {
                          "@type": "ListItem",
                          position: 3,
                          name: product.category.name,
                          item: `${SITE_URL}/shop`,
                      },
                  ]
                : []),

            {
                "@type": "ListItem",

                position:
                    product.category?.name
                        ? 4
                        : 3,

                name: product.name,

                item: productUrl,
            },
        ],
    };

    return (
        <>
            <Helmet>
                <title>
                    {product.name} | Souk Fashion House
                </title>

                <meta
                    name="description"
                    content={productDescription}
                />

                <meta
                    name="keywords"
                    content={[
                        product.name,
                        product.brand,
                        product.category?.name,
                        "Souk Fashion House",
                        "fashion",
                        "women fashion",
                        "modest fashion",
                        "ethnic wear",
                    ]
                        .filter(Boolean)
                        .join(", ")}
                />

                <meta
                    name="robots"
                    content="index, follow"
                />

                <link
                    rel="canonical"
                    href={productUrl}
                />

                <meta
                    property="og:type"
                    content="product"
                />

                <meta
                    property="og:title"
                    content={`${product.name} | Souk Fashion House`}
                />

                <meta
                    property="og:description"
                    content={productDescription}
                />

                <meta
                    property="og:image"
                    content={productImage}
                />

                <meta
                    property="og:url"
                    content={productUrl}
                />

                <meta
                    property="og:site_name"
                    content="Souk Fashion House"
                />

                <meta
                    property="product:price:amount"
                    content={Number(
                        finalPrice
                    ).toFixed(2)}
                />

                <meta
                    property="product:price:currency"
                    content="INR"
                />

                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />

                <meta
                    name="twitter:title"
                    content={`${product.name} | Souk Fashion House`}
                />

                <meta
                    name="twitter:description"
                    content={productDescription}
                />

                <meta
                    name="twitter:image"
                    content={productImage}
                />

                <script type="application/ld+json">
                    {JSON.stringify(
                        productSchema
                    )}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify(
                        breadcrumbSchema
                    )}
                </script>
            </Helmet>

            <Navbar />

            <section className="product-details">
                <div className="product-container">

                    <div className="gallery-section">

                        {product.images?.length > 1 && (
                            <div className="thumbnail-list">

                                {product.images.map(
                                    (image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`${product.name} ${
                                                index + 1
                                            }`}
                                            className={`thumbnail ${
                                                selectedImage ===
                                                index
                                                    ? "active-thumbnail"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedImage(
                                                    index
                                                )
                                            }
                                        />
                                    )
                                )}

                            </div>
                        )}

                        <div className="main-image-box">

                            <img
                                src={
                                    product.images?.[
                                        selectedImage
                                    ]?.url ||
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

                        <h1>
                            {product.name}
                        </h1>

                        <div className="rating-row">

                            {[1, 2, 3, 4, 5].map(
                                (star) =>
                                    star <=
                                    Math.round(
                                        product.averageRating ||
                                            0
                                    ) ? (
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
                                {product.averageRating ||
                                    0}{" "}
                                (
                                {product.totalReviews ||
                                    0} Reviews)
                            </span>

                        </div>

                        <div className="price-wrapper">

                            {discount > 0 && (
                                <span className="old-price">
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            )}

                            <span className="new-price">
                                ₹
                                {Number(
                                    finalPrice
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                            {discount > 0 && (
                                <span
                                    className="discount-badge-details"
                                    style={{
                                        marginLeft:
                                            "12px",
                                        background:
                                            "#dc3545",
                                        color: "#fff",
                                        padding:
                                            "4px 10px",
                                        borderRadius:
                                            "4px",
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
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
                                <strong>
                                    Category
                                </strong>

                                <span>
                                    {
                                        product
                                            .category
                                            ?.name
                                    }
                                </span>
                            </div>

                            <div>
                                <strong>
                                    SKU
                                </strong>

                                <span>
                                    {product.sku ||
                                        "N/A"}
                                </span>
                            </div>

                            <div>
                                <strong>
                                    Availability
                                </strong>

                                {product.stock >
                                0 ? (
                                    <span className="in-stock">
                                        In Stock (
                                        {
                                            product.stock
                                        }
                                        )
                                    </span>
                                ) : (
                                    <span className="out-stock">
                                        Out of Stock
                                    </span>
                                )}

                            </div>

                        </div>

                        {product.colors
                            ?.length > 0 && (
                            <>
                                <h4 className="section-title">
                                    Available Colors
                                </h4>

                                <div className="color-list">

                                    {product.colors.map(
                                        (
                                            color,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    index
                                                }
                                                className="color-item"
                                            >
                                                {color}
                                            </span>
                                        )
                                    )}

                                </div>
                            </>
                        )}

                        {product?.sizes
                            ?.length > 0 && (
                            <div className="size-section">

                                <h4 className="section-title">
                                    Select Size
                                </h4>

                                <div className="size-options">

                                    {product.sizes.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const size =
                                                Number(
                                                    item.size
                                                );

                                            const stock =
                                                Number(
                                                    item.stock ||
                                                        0
                                                );

                                            const isOutOfStock =
                                                stock <=
                                                0;

                                            const isSelected =
                                                Number(
                                                    selectedSize
                                                ) ===
                                                size;

                                            return (
                                                <button
                                                    key={`${size}-${index}`}
                                                    type="button"
                                                    className={`size-option ${
                                                        isSelected
                                                            ? "selected"
                                                            : ""
                                                    } ${
                                                        isOutOfStock
                                                            ? "out-of-stock"
                                                            : ""
                                                    }`}
                                                    disabled={
                                                        isOutOfStock
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            isOutOfStock
                                                        )
                                                            return;

                                                        setSelectedSize(
                                                            size
                                                        );

                                                        setQuantity(
                                                            (
                                                                currentQuantity
                                                            ) =>
                                                                currentQuantity >
                                                                stock
                                                                    ? stock
                                                                    : currentQuantity
                                                        );
                                                    }}
                                                >
                                                    <span className="size-number">
                                                        {
                                                            size
                                                        }
                                                    </span>

                                                    <span className="size-stock">
                                                        {isOutOfStock
                                                            ? "Out of Stock"
                                                            : `${stock} left`}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>
                        )}

                        <div className="quantity-box">

                            <button
                                type="button"
                                onClick={
                                    decreaseQty
                                }
                                disabled={
                                    quantity <=
                                    1
                                }
                            >
                                <FaMinus />
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={
                                    increaseQty
                                }
                                disabled={
                                    quantity >=
                                    availableStock
                                }
                            >
                                <FaPlus />
                            </button>

                        </div>

                        <div className="action-buttons">

                            <button
                                type="button"
                                className="cart-btn"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    availableStock <=
                                    0
                                }
                            >
                                {availableStock <=
                                0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </button>

                            <button
                                type="button"
                                className="wishlist-btn-details"
                                onClick={
                                    handleWishlist
                                }
                            >
                                {isWishlisted ? (
                                    <>
                                        <FaHeart />
                                        <span>
                                            Wishlisted
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaRegHeart />
                                        <span>
                                            Add to Wishlist
                                        </span>
                                    </>
                                )}
                            </button>

                        </div>

                        <div className="extra-info">

                            <div>
                                🚚 Free Delivery on
                                all orders
                            </div>

                            <div>
                                ↩ 7 Days Easy Return
                            </div>

                            <div>
                                🔒 100% Secure
                                Checkout
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <section className="related-products">

                <div className="container">

                    <h2>
                        You May Also Like
                    </h2>

                    {relatedProducts.length >
                    0 ? (
                        <div className="row g-4">

                            {relatedProducts.map(
                                (item) => (
                                    <div
                                        className="col-lg-3 col-md-6"
                                        key={
                                            item._id
                                        }
                                    >
                                        <ProductCard
                                            product={
                                                item
                                            }
                                        />
                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <p
                            style={{
                                textAlign:
                                    "center",
                                marginTop:
                                    "20px",
                            }}
                        >
                            No related products
                            available.
                        </p>
                    )}

                </div>

            </section>

            <div className="reviews-wrapper">

                <ReviewList
                    productId={
                        product._id
                    }
                    refresh={
                        reviewRefresh
                    }
                />

            </div>

            <Footer />
        </>
    );
};

export default ProductDetails;