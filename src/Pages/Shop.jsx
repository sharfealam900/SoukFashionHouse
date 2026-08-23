import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEO from "../Components/SEO";

import { getProducts } from "../services/productApi";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("featured");

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await getProducts();

                setProducts(data?.products || []);
            } catch (err) {
                console.error("Shop Products Error:", err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = useMemo(() => {
        const categoryMap = new Map();

        products.forEach((product) => {
            const productCategory = product?.category;

            if (!productCategory) return;

            const id =
                productCategory?._id ||
                productCategory?.id ||
                productCategory?.name;

            const name =
                productCategory?.name ||
                "Uncategorized";

            if (id && !categoryMap.has(id)) {
                categoryMap.set(id, {
                    id,
                    name,
                });
            }
        });

        return Array.from(categoryMap.values());
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const searchValue = search.trim().toLowerCase();

        if (searchValue) {
            result = result.filter((product) => {
                const name =
                    product?.name?.toLowerCase() || "";

                const description =
                    product?.description?.toLowerCase() || "";

                const categoryName =
                    product?.category?.name?.toLowerCase() || "";

                return (
                    name.includes(searchValue) ||
                    description.includes(searchValue) ||
                    categoryName.includes(searchValue)
                );
            });
        }

        if (category !== "all") {
            result = result.filter((product) => {
                const productCategory = product?.category;

                const categoryId =
                    productCategory?._id ||
                    productCategory?.id ||
                    productCategory?.name;

                return String(categoryId) === String(category);
            });
        }

        switch (sort) {
            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a?.price || 0) -
                        Number(b?.price || 0)
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b?.price || 0) -
                        Number(a?.price || 0)
                );
                break;

            case "newest":
                result.sort((a, b) => {
                    const dateA = new Date(
                        a?.createdAt || 0
                    ).getTime();

                    const dateB = new Date(
                        b?.createdAt || 0
                    ).getTime();

                    return dateB - dateA;
                });
                break;

            case "featured":
            default:
                break;
        }

        return result;
    }, [products, search, category, sort]);

    const getProductPrice = (product) => {
        const price = Number(product?.price || 0);
        const discount = Number(product?.discount || 0);

        if (discount <= 0) {
            return price;
        }

        return price - (price * discount) / 100;
    };

    const getProductImage = (product) => {
        if (!product?.images?.length) {
            return "/logo.jpg";
        }

        const firstImage = product.images[0];

        if (typeof firstImage === "string") {
            return firstImage;
        }

        return (
            firstImage?.url ||
            firstImage?.secure_url ||
            "/logo.jpg"
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setSort("featured");
    };

    const hasActiveFilters =
        search.trim() !== "" ||
        category !== "all" ||
        sort !== "featured";

    return (
        <>
            <SEO
                title="Shop | Souk Fashion House"
                description="Shop elegant fashion, modern modest wear, kurtis, shawls, dupattas and handcrafted styles from Souk Fashion House."
                keywords="shop fashion, women's fashion, modest fashion, kurtis, shawls, dupattas, ethnic wear, Souk Fashion House"
                url="/shop"
            />

            <Navbar />

            <main className="shop-page">

                {/* HERO */}

                <section className="shop-hero">

                    <div className="shop-hero-content">

                        <span className="shop-eyebrow">
                            SOUK COLLECTION
                        </span>

                        <h1>
                            Discover Your
                            <span> Signature Style</span>
                        </h1>

                        <p>
                            Explore our curated collection of
                            elegant fashion, timeless fabrics
                            and modern modest silhouettes.
                        </p>

                    </div>

                </section>

                {/* SHOP CONTENT */}

                <section className="shop-container">

                    {/* TOP BAR */}

                    <div className="shop-topbar">

                        <div>
                            <span className="shop-result-label">
                                OUR COLLECTION
                            </span>

                            <h2>
                                Shop All
                            </h2>

                            {!loading && (
                                <p>
                                    {filteredProducts.length}{" "}
                                    {filteredProducts.length === 1
                                        ? "product"
                                        : "products"}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            className="shop-filter-toggle"
                            onClick={() =>
                                setShowFilters(
                                    !showFilters
                                )
                            }
                        >
                            <SlidersHorizontal size={18} />

                            <span>
                                Filters
                            </span>
                        </button>

                    </div>

                    {/* FILTER BAR */}

                    <div
                        className={`shop-filters ${
                            showFilters
                                ? "shop-filters-open"
                                : ""
                        }`}
                    >

                        {/* SEARCH */}

                        <div className="shop-search">

                            <Search size={18} />

                            <input
                                type="search"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>

                        {/* CATEGORY */}

                        <div className="shop-category-filter">

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All Categories
                                </option>

                                {categories.map(
                                    (item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        {/* SORT */}

                        <div className="shop-sort">

                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="featured">
                                    Featured
                                </option>

                                <option value="newest">
                                    Newest
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>
                            </select>

                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="shop-clear-filter"
                                onClick={clearFilters}
                            >
                                Clear All
                            </button>
                        )}

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="shop-error">
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* LOADING */}

                    {loading && (
                        <div className="shop-product-grid">

                            {Array.from({
                                length: 8,
                            }).map((_, index) => (
                                <div
                                    className="shop-skeleton-card"
                                    key={index}
                                >
                                    <div className="shop-skeleton-image"></div>

                                    <div className="shop-skeleton-line"></div>

                                    <div className="shop-skeleton-small"></div>

                                    <div className="shop-skeleton-price"></div>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* PRODUCTS */}

                    {!loading &&
                        !error &&
                        filteredProducts.length > 0 && (
                            <div className="shop-product-grid">

                                {filteredProducts.map(
                                    (product) => {
                                        const finalPrice =
                                            getProductPrice(
                                                product
                                            );

                                        const originalPrice =
                                            Number(
                                                product?.price ||
                                                    0
                                            );

                                        const discount =
                                            Number(
                                                product?.discount ||
                                                    0
                                            );

                                        return (
                                            <Link
                                                key={
                                                    product._id
                                                }
                                                to={`/products/${product.slug}`}
                                                className="shop-product-card"
                                            >

                                                {/* IMAGE */}

                                                <div className="shop-product-image">

                                                    <img
                                                        src={getProductImage(
                                                            product
                                                        )}
                                                        alt={
                                                            product?.name ||
                                                            "Fashion product"
                                                        }
                                                        loading="lazy"
                                                        decoding="async"
                                                    />

                                                    {discount >
                                                        0 && (
                                                        <span className="shop-discount-badge">
                                                            -
                                                            {
                                                                discount
                                                            }
                                                            %
                                                        </span>
                                                    )}

                                                    {product?.stock <=
                                                        0 && (
                                                        <span className="shop-stock-badge">
                                                            OUT OF STOCK
                                                        </span>
                                                    )}

                                                </div>

                                                {/* INFO */}

                                                <div className="shop-product-info">

                                                    <span className="shop-product-category">
                                                        {
                                                            product
                                                                ?.category
                                                                ?.name
                                                        }
                                                    </span>

                                                    <h3>
                                                        {
                                                            product?.name
                                                        }
                                                    </h3>

                                                    <div className="shop-product-price">

                                                        <strong>
                                                            ₹
                                                            {finalPrice.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                        {discount >
                                                            0 && (
                                                            <span>
                                                                ₹
                                                                {originalPrice.toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                    <div className="shop-product-view">
                                                        <span>
                                                            View
                                                            Product
                                                        </span>

                                                        <span>
                                                            →
                                                        </span>
                                                    </div>

                                                </div>

                                            </Link>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filteredProducts.length ===
                            0 && (
                            <div className="shop-empty">

                                <div className="shop-empty-icon">
                                    <Search size={28} />
                                </div>

                                <h3>
                                    No products found
                                </h3>

                                <p>
                                    Try changing your search
                                    or filters to discover
                                    something new.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    View All Products
                                </button>

                            </div>
                        )}

                </section>

            </main>

            <Footer />
        </>
    );
}