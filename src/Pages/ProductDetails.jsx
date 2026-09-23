import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    FaMinus,
    FaPlus,
    FaRegStar,
    FaStar,
    FaHeart,
    FaRegHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

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
    addToWishlist, removeWishlistItem, getWishlist,
} from "../features/wishlist/wishlistApi";

import { setWishlist } from "../features/wishlist/wishlistSlice";

import ProductCard from "../Components/Product/ProductCard";
import ReviewList from "../Components/Reviews/ReviewList";
import DeliveryEstimator from "../Components/Delivery/DeliveryEstimator";
import KurtiSizeChart from "../Components/Product/KurtiSizeChart";



const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://www.soukfashionhouse.com";

const stripHtml = (value = "") =>
    value
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

const getProductDetailRows = (product) => {
    const details = product?.productDetails || {};

    const variantColour = Array.isArray(product?.colorVariants)
        ? product.colorVariants
            .map((variant) => variant?.name)
            .filter(Boolean)
            .join(", ")
        : "";

    const sizeLabel = Array.isArray(product?.sizes)
        ? product.sizes
            .map((item) => item?.size)
            .filter(
                (size) =>
                    size !== undefined &&
                    size !== null &&
                    size !== ""
            )
            .join(", ")
        : "";

    return [
        ["Brand", product?.brand],
        ["Product Type", details.productType],
        ["Fabric", details.fabric],
        ["Work", details.work],
        ["Pattern", details.pattern],
        ["Neck Type", details.neckType],
        ["Sleeve Type", details.sleeveType],
        ["Fit", details.fit],
        ["Colour", details.colour || variantColour],
        ["Season", details.season],
        ["Sizes Available", details.sizesAvailable || sizeLabel],
        ["Closure", details.closure],
        ["Occasion", details.occasion],
        ["Length", details.length],
        ["Package Contains", details.packageContains],
        ["Workmanship", details.workmanship],
        ["Country of Origin", details.countryOfOrigin],
    ].filter(
        ([, value]) =>
            String(value ?? "").trim() !== ""
    );
};

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
    const [selectedColor, setSelectedColor] = useState("");

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [detailsExpanded, setDetailsExpanded] =
        useState(false);

    const [sizeChartOpen, setSizeChartOpen] =
        useState(false);


    const colorVariants = useMemo(() => {
        if (
            Array.isArray(product?.colorVariants) &&
            product.colorVariants.length
        ) {
            return product.colorVariants;
        }

        if (
            Array.isArray(product?.colors) &&
            product.colors.length
        ) {
            return product.colors.map((name) => ({
                name,
                hex: "",
                images: [],
            }));
        }

        return [];
    }, [product]);

    const selectedVariant = useMemo(() => {
        return colorVariants.find(
            (variant) =>
                variant.name === selectedColor
        );
    }, [colorVariants, selectedColor]);

    const activeImages = useMemo(() => {
        if (selectedVariant?.images?.length) {
            return selectedVariant.images;
        }

        return product?.images || [];
    }, [product, selectedVariant]);

    const availableStock =
        selectedSize !== null &&
            product?.sizes?.length
            ? Number(
                product.sizes.find(
                    (item) =>
                        Number(item.size) ===
                        Number(selectedSize)
                )?.stock || 0
            )
            : Number(product?.stock || 0);

    useEffect(() => {
        fetchProduct();

        if (localStorage.getItem("token")) {
            loadWishlist();
        }
    }, [id]);

    useEffect(() => {
        setSelectedImage(0);
    }, [selectedColor]);

    useEffect(() => {
        if (
            colorVariants.length &&
            !selectedColor
        ) {
            setSelectedColor(
                colorVariants[0].name
            );
        }
    }, [colorVariants, selectedColor]);

    useEffect(() => {
        if (
            selectedSize !== null &&
            availableStock > 0 &&
            quantity > availableStock
        ) {
            setQuantity(availableStock);
        }
    }, [
        selectedSize,
        availableStock,
        quantity,
    ]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const { data } = await getProduct(id);

            const productData = data.product;

            let productSizes =
                productData.sizes || [];

            if (
                Array.isArray(productSizes) &&
                productSizes.length === 1 &&
                typeof productSizes[0] === "string"
            ) {
                try {
                    productSizes = JSON.parse(
                        productSizes[0]
                    );
                } catch {
                    productSizes = [];
                }
            }

            productData.sizes = Array.isArray(
                productSizes
            )
                ? productSizes
                    .map((item) => ({
                        size: Number(item.size),
                        stock: Number(item.stock || 0),
                    }))
                    .filter((item) =>
                        Number.isFinite(item.size)
                    )
                : [];

            setProduct(productData);

            setSelectedImage(0);
            setQuantity(1);
            setSelectedSize(null);

            setSelectedColor(
                productData.colorVariants?.[0]
                    ?.name ||
                productData.colors?.[0] ||
                ""
            );

            if (
                productData.category?._id &&
                productData._id
            ) {
                fetchRelatedProducts(
                    productData.category._id,
                    productData._id
                );
            }
        } catch (error) {
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
            console.error(error);
        }
    };

    const loadWishlist = async () => {
        try {
            const { data } =
                await getWishlist();

            dispatch(
                setWishlist(
                    data.wishlist?.products || []
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const isWishlisted =
        wishlist?.some(
            (item) =>
                item._id === product?._id
        ) || false;

    const discount = Number(
        product?.discount || 0
    );

    const finalPrice =
        Number(product?.price || 0) -
        (Number(product?.price || 0) *
            discount) /
        100;

    const productImage =
        activeImages?.[0]?.url ||
        product?.images?.[0]?.url ||
        `${SITE_URL}/logo.jpg`;

    const productUrl = `${SITE_URL}/products/${product?.slug ||
        product?._id ||
        id
        }`;

    const productDescription = stripHtml(
        product?.description ||
        `Shop ${product?.name || "product"
        } at Souk Fashion House.`
    ).slice(0, 160);

    const availability =
        Number(availableStock) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock";

    const productSchema = product
        ? {
            "@context":
                "https://schema.org",
            "@type": "Product",
            name: product.name,
            description:
                product.description,
            image: activeImages
                .map((image) => image.url)
                .filter(Boolean),
            sku:
                product.sku || undefined,
            brand: {
                "@type": "Brand",
                name:
                    product.brand ||
                    "Souk Fashion House",
            },
            category:
                product.category?.name ||
                undefined,
            url: productUrl,
            offers: {
                "@type": "Offer",
                url: productUrl,
                priceCurrency: "INR",
                price:
                    Number(finalPrice).toFixed(
                        2
                    ),
                availability,
                itemCondition:
                    "https://schema.org/NewCondition",
                seller: {
                    "@type":
                        "Organization",
                    name:
                        "Souk Fashion House",
                },
            },
            ...(Number(
                product.totalReviews || 0
            ) > 0 &&
                Number(
                    product.averageRating || 0
                ) > 0
                ? {
                    aggregateRating: {
                        "@type":
                            "AggregateRating",
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
        }
        : null;

    const breadcrumbSchema = product
        ? {
            "@context":
                "https://schema.org",
            "@type":
                "BreadcrumbList",
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
                            "@type":
                                "ListItem",
                            position: 3,
                            name:
                                product.category
                                    .name,
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
        }
        : null;

    const increaseQty = () => {
        if (
            quantity < availableStock
        ) {
            setQuantity(
                (value) => value + 1
            );
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(
                (value) => value - 1
            );
        }
    };

    const handleAddToCart = async () => {
        try {
            if (
                colorVariants.length > 0 &&
                !selectedColor
            ) {
                toast.error(
                    "Please select a color"
                );
                return;
            }

            if (
                product?.sizes?.length > 0 &&
                selectedSize === null
            ) {
                toast.error(
                    "Please select a size"
                );
                return;
            }

            if (availableStock <= 0) {
                toast.error(
                    "Selected option is out of stock"
                );
                return;
            }

            if (
                quantity > availableStock
            ) {
                toast.error(
                    `Only ${availableStock} item(s) available`
                );
                return;
            }

            await addToCart(
                product._id,
                quantity,
                selectedSize,
                selectedColor
            );

            const { data } =
                await getCart();

            dispatch(setCart(data.cart));

            toast.success(
                "Product added to cart"
            );
        } catch (error) {
            if (
                error.response?.status ===
                401
            ) {
                toast.error(
                    "Please login first"
                );
                return;
            }

            toast.error(
                error.response?.data
                    ?.message ||
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
                    data.wishlist?.products ||
                    []
                )
            );
        } catch (error) {
            if (
                error.response?.status ===
                401
            ) {
                toast.error(
                    "Please login first"
                );
                return;
            }

            toast.error(
                error.response?.data
                    ?.message ||
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

    const detailRows =
        getProductDetailRows(product);

    const sizeFitLabels = [
        "Brand",
        "Fit",
        "Sleeve Type",
        "Neck Type",
        "Length",
        "Sizes Available",
    ];

    const materialLabels = [
        "Fabric",
        "Work",
        "Workmanship",
        "Pattern",
    ];

    const specificationLabels =
        detailRows.filter(
            ([label]) =>
                ![
                    ...sizeFitLabels,
                    ...materialLabels,
                ].includes(label)
        );

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

                {productSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(
                            productSchema
                        )}
                    </script>
                )}

                {breadcrumbSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(
                            breadcrumbSchema
                        )}
                    </script>
                )}
            </Helmet>

            <Navbar />

            <main className="souk-product-page">

                <section className="souk-product-shell">



                    <div className="souk-product-gallery">
                        <div className="souk-product-main-image-box">
                            <img
                                src={
                                    activeImages[selectedImage]?.url ||
                                    productImage
                                }
                                alt={`${product.name} ${selectedImage + 1}`}
                                className="souk-product-main-image"
                            />
                        </div>

                        {activeImages.length > 1 && (
                            <div className="souk-product-thumbnails">
                                {activeImages.map((image, index) => (
                                    <button
                                        key={`${image.public_id || image.url}-${index}`}
                                        type="button"
                                        className={`souk-product-thumbnail ${selectedImage === index ? "active" : ""
                                            }`}
                                        onClick={() => setSelectedImage(index)}
                                        aria-label={`View ${product.name} image ${index + 1}`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>



                    <div className="souk-product-info">

                        <div className="souk-product-category">
                            {product.category?.name ||
                                "Fashion"}
                        </div>

                        <h1>
                            {product.name}
                        </h1>


                        {/* Rating */}

                        <div className="souk-product-rating">

                            <span className="souk-stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) =>
                                        star <=
                                            Math.round(
                                                product.averageRating ||
                                                0
                                            ) ? (
                                            <FaStar
                                                key={star}
                                            />
                                        ) : (
                                            <FaRegStar
                                                key={star}
                                            />
                                        )
                                )}

                            </span>

                            <span>
                                {Number(
                                    product.averageRating ||
                                    0
                                ).toFixed(1)}{" "}
                                (
                                {product.totalReviews ||
                                    0}{" "}
                                Reviews)
                            </span>

                        </div>


                        {/* Price */}

                        <div className="souk-product-price">

                            <strong>
                                ₹
                                {Number(
                                    finalPrice
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                            {discount > 0 && (
                                <>
                                    <span className="souk-old-price">
                                        ₹
                                        {Number(
                                            product.price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                    <span className="souk-discount">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}

                        </div>


                        {/* Short description */}

                        <p className="souk-short-description">
                            {stripHtml(
                                product.description
                            ).slice(0, 180)}
                        </p>


                        {/* =========================
                SIZE
            ========================== */}

                        {product.sizes?.length >
                            0 && (
                                <div className="souk-option-group">

                                    <div className="souk-option-title-row">

                                        <div className="souk-option-title">
                                            SELECT SIZE
                                        </div>

                                        <button
                                            type="button"
                                            className="souk-size-chart"
                                            onClick={() =>
                                                setSizeChartOpen(true)
                                            }
                                        >
                                            SIZE CHART
                                        </button>

                                    </div>

                                    <div className="souk-size-options">

                                        {product.sizes.map(
                                            (item) => {
                                                const size =
                                                    Number(
                                                        item.size
                                                    );

                                                const stock =
                                                    Number(
                                                        item.stock ||
                                                        0
                                                    );

                                                const selected =
                                                    Number(
                                                        selectedSize
                                                    ) === size;

                                                return (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        disabled={
                                                            stock <= 0
                                                        }
                                                        className={`souk-size-option ${selected
                                                            ? "selected"
                                                            : ""
                                                            } ${stock <= 0
                                                                ? "disabled"
                                                                : ""
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedSize(
                                                                size
                                                            );

                                                            setQuantity(
                                                                (value) =>
                                                                    Math.min(
                                                                        value,
                                                                        stock ||
                                                                        1
                                                                    )
                                                            );
                                                        }}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>

                                </div>
                            )}




                        {colorVariants.length >
                            0 && (
                                <div className="souk-option-group">

                                    <div className="souk-option-title">
                                        SELECT COLOUR
                                    </div>

                                    <div className="souk-color-options">

                                        {colorVariants.map(
                                            (variant) => (
                                                <button
                                                    key={
                                                        variant.name
                                                    }
                                                    type="button"
                                                    className={`souk-color-option ${selectedColor ===
                                                        variant.name
                                                        ? "selected"
                                                        : ""
                                                        }`}
                                                    onClick={() =>
                                                        setSelectedColor(
                                                            variant.name
                                                        )
                                                    }
                                                    aria-label={
                                                        variant.name
                                                    }
                                                    title={
                                                        variant.name
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                variant.hex ||
                                                                "#ddd",
                                                        }}
                                                    />
                                                </button>
                                            )
                                        )}

                                    </div>

                                    <div className="souk-selected-color">
                                        {selectedColor}
                                    </div>

                                </div>
                            )}




                        <div className="souk-buy-row">

                            <div className="souk-quantity-row">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQty
                                    }
                                    disabled={
                                        quantity <= 1
                                    }
                                    aria-label="Decrease quantity"
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
                                    aria-label="Increase quantity"
                                >
                                    <FaPlus />
                                </button>

                            </div>

                            <button
                                type="button"
                                className="souk-add-cart"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    availableStock <= 0
                                }
                            >
                                {availableStock <= 0
                                    ? "Out of Stock"
                                    : "ADD TO BAG"}
                            </button>

                            <button
                                type="button"
                                className={`souk-wishlist ${isWishlisted
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={
                                    handleWishlist
                                }
                                aria-label="Wishlist"
                            >
                                {isWishlisted ? (
                                    <FaHeart />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>

                        </div>



                        <DeliveryEstimator />



                        <div className="souk-myntra-block">

                            <div className="souk-myntra-heading">

                                <span>
                                    BEST OFFERS
                                </span>

                                <span>
                                    ♡
                                </span>

                            </div>

                            <ul className="souk-offer-list">

                                <li>
                                    Free delivery on eligible orders
                                </li>

                                <li>
                                    Exclusive offers may be available at checkout
                                </li>

                                <li>
                                    Secure checkout and multiple payment options
                                </li>

                            </ul>

                        </div>



                        <div className="souk-inline-details">

                            <div className="souk-inline-details-heading">

                                <span>
                                    PRODUCT DETAILS
                                </span>

                                <span>
                                    ▤
                                </span>

                            </div>


                            {/* Main Description */}

                            <p className="souk-inline-description">
                                {stripHtml(
                                    product.description
                                )}
                            </p>


                            {/* =========================
                  SIZE & FIT
              ========================== */}

                            {detailRows.filter(
                                ([label]) =>
                                    sizeFitLabels.includes(
                                        label
                                    )
                            ).length > 0 && (

                                    <div className="souk-detail-group">

                                        <h3>
                                            Size &amp; Fit
                                        </h3>

                                        <div className="souk-spec-grid">

                                            {detailRows
                                                .filter(
                                                    ([label]) =>
                                                        sizeFitLabels.includes(
                                                            label
                                                        )
                                                )
                                                .map(
                                                    ([
                                                        label,
                                                        value,
                                                    ]) => (
                                                        <div
                                                            className="souk-spec-item"
                                                            key={label}
                                                        >
                                                            <span>
                                                                {label}
                                                            </span>

                                                            <strong>
                                                                {value}
                                                            </strong>
                                                        </div>
                                                    )
                                                )}

                                        </div>

                                    </div>
                                )}


                            {/* =========================
                  MATERIAL & CARE
              ========================== */}

                            {detailRows.filter(
                                ([label]) =>
                                    materialLabels.includes(
                                        label
                                    )
                            ).length > 0 && (

                                    <div className="souk-detail-group">

                                        <h3>
                                            Material &amp; Care
                                        </h3>

                                        <div className="souk-spec-grid">

                                            {detailRows
                                                .filter(
                                                    ([label]) =>
                                                        materialLabels.includes(
                                                            label
                                                        )
                                                )
                                                .map(
                                                    ([
                                                        label,
                                                        value,
                                                    ]) => (
                                                        <div
                                                            className="souk-spec-item"
                                                            key={label}
                                                        >
                                                            <span>
                                                                {label}
                                                            </span>

                                                            <strong>
                                                                {value}
                                                            </strong>
                                                        </div>
                                                    )
                                                )}

                                        </div>


                                        {Array.isArray(
                                            product
                                                .productDetails
                                                ?.careInstructions
                                        ) &&
                                            product
                                                .productDetails
                                                .careInstructions
                                                .length >
                                            0 && (

                                                <ul className="souk-care-list">

                                                    {product.productDetails.careInstructions.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={`${item}-${index}`}
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}

                                                </ul>
                                            )}

                                    </div>
                                )}


                            {/* =========================
                  SPECIFICATIONS
              ========================== */}

                            {specificationLabels
                                .length > 0 && (

                                    <div className="souk-detail-group">

                                        <h3>
                                            Specifications
                                        </h3>

                                        <div className="souk-spec-grid">

                                            {specificationLabels
                                                .slice(
                                                    0,
                                                    detailsExpanded
                                                        ? undefined
                                                        : 6
                                                )
                                                .map(
                                                    ([
                                                        label,
                                                        value,
                                                    ]) => (
                                                        <div
                                                            className="souk-spec-item"
                                                            key={label}
                                                        >
                                                            <span>
                                                                {label}
                                                            </span>

                                                            <strong>
                                                                {value}
                                                            </strong>
                                                        </div>
                                                    )
                                                )}

                                        </div>

                                    </div>
                                )}


                            {/* =========================
                  DELIVERY SERVICES
              ========================== */}

                            {detailsExpanded &&
                                Array.isArray(
                                    product
                                        .productDetails
                                        ?.deliveryServices
                                ) &&
                                product
                                    .productDetails
                                    .deliveryServices
                                    .length > 0 && (

                                    <div className="souk-detail-group">

                                        <h3>
                                            Delivery &amp; Services
                                        </h3>

                                        <ul className="souk-care-list">

                                            {product.productDetails.deliveryServices.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={`${item}-${index}`}
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}

                                        </ul>

                                    </div>
                                )}


                            {/* Note */}

                            {detailsExpanded &&
                                product.productDetails
                                    ?.note && (

                                    <p className="souk-product-detail-note">

                                        <strong>
                                            Note:
                                        </strong>{" "}

                                        {
                                            product
                                                .productDetails
                                                .note
                                        }

                                    </p>
                                )}


                            {/* See More */}

                            <button
                                type="button"
                                className="souk-see-more"
                                onClick={() =>
                                    setDetailsExpanded(
                                        (value) =>
                                            !value
                                    )
                                }
                            >
                                {detailsExpanded
                                    ? "See Less"
                                    : "See More"}
                            </button>

                        </div>

                    </div>

                </section>




                <section className="souk-related-section">

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
                                            key={item._id}
                                        >
                                            <ProductCard
                                                product={item}
                                            />
                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <p className="souk-related-empty">
                                No related products available.
                            </p>
                        )}

                    </div>

                </section>




                <div className="reviews-wrapper">
                    <ReviewList
                        productId={product._id}
                    />
                </div>

            </main>

            <Footer />

            <KurtiSizeChart
                isOpen={sizeChartOpen}
                onClose={() =>
                    setSizeChartOpen(false)
                }
                productSizes={product.sizes}
            />



        </>
    );
};

export default ProductDetails;