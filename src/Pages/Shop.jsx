import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEO from "../Components/SEO";
import { getProducts } from "../features/product/productApi";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("featured");

    const [showFilters, setShowFilters] = useState(false);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const limit = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [page, search, category, sort]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await getProducts({
                page,
                limit,
                search: search.trim(),
                category,
                sort,
            });

            setProducts(data?.products || []);

            setTotal(
                data?.pagination?.total || 0
            );

            setTotalPages(
                data?.pagination?.totalPages || 1
            );

            setHasNextPage(
                Boolean(
                    data?.pagination?.hasNextPage
                )
            );

            setHasPreviousPage(
                Boolean(
                    data?.pagination?.hasPreviousPage
                )
            );
        } catch (err) {
            console.error(
                "Shop Products Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load products."
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setPage(1);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setSort("featured");
        setPage(1);
    };

    const getProductPrice = (product) => {
        const price = Number(
            product?.price || 0
        );

        const discount = Number(
            product?.discount || 0
        );

        if (discount <= 0) {
            return price;
        }

        return (
            price -
            (price * discount) / 100
        );
    };

    const getProductImage = (product) => {
        if (!product?.images?.length) {
            return "/logo.jpg";
        }

        const firstImage =
            product.images[0];

        if (typeof firstImage === "string") {
            return firstImage;
        }

        return (
            firstImage?.url ||
            firstImage?.secure_url ||
            "/logo.jpg"
        );
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

                <section className="shop-hero">
                    <div className="shop-hero-content">
                        <span className="shop-eyebrow">
                            SOUK COLLECTION
                        </span>

                        <h1>
                            Discover Your
                            <span>
                                {" "}
                                Signature Style
                            </span>
                        </h1>

                        <p>
                            Explore our curated collection of
                            elegant fashion, timeless fabrics
                            and modern modest silhouettes.
                        </p>
                    </div>
                </section>

                <section className="shop-container">

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
                                    {total}{" "}
                                    {total === 1
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
                            <SlidersHorizontal
                                size={18}
                            />

                            <span>
                                Filters
                            </span>
                        </button>

                    </div>

                    <div
                        className={`shop-filters ${
                            showFilters
                                ? "shop-filters-open"
                                : ""
                        }`}
                    >

                        <div className="shop-search">

                            <Search size={18} />

                            <input
                                type="search"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSearchChange(
                                            ""
                                        )
                                    }
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>

                        <div className="shop-category-filter">

                            <select
                                value={category}
                                onChange={(e) =>
                                    handleCategoryChange(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    All Categories
                                </option>
                            </select>

                        </div>

                        <div className="shop-sort">

                            <select
                                value={sort}
                                onChange={(e) =>
                                    handleSortChange(
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

                    {error && (
                        <div className="shop-error">
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={fetchProducts}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="shop-product-grid">

                            {Array.from({
                                length: 8,
                            }).map((_, index) => (
                                <div
                                    className="shop-skeleton-card"
                                    key={index}
                                >
                                    <div className="shop-skeleton-image" />
                                    <div className="shop-skeleton-line" />
                                    <div className="shop-skeleton-small" />
                                    <div className="shop-skeleton-price" />
                                </div>
                            ))}

                        </div>
                    )}

                    {!loading &&
                        !error &&
                        products.length > 0 && (
                            <div className="shop-product-grid">

                                {products.map(
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

                    {!loading &&
                        !error &&
                        products.length === 0 && (
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

                    {!loading &&
                        !error &&
                        totalPages > 1 && (
                            <div className="shop-pagination">

                                <button
                                    type="button"
                                    disabled={
                                        !hasPreviousPage
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                Math.max(
                                                    current - 1,
                                                    1
                                                )
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {page} of{" "}
                                    {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        !hasNextPage
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                Math.min(
                                                    current + 1,
                                                    totalPages
                                                )
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>
                        )}

                </section>

            </main>

            <Footer />
        </>
    );
}