import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axios";
import ProductCard from "../Components/Product/ProductCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Shop() {
    const [products, setProducts] = useState([]);

    const [searchParams] = useSearchParams();

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [price, setPrice] = useState(100000);

    const [sortBy, setSortBy] =
        useState("newest");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const productsPerPage = 9;


    /* =====================================================
       UPDATE SEARCH FROM URL
    ===================================================== */

    useEffect(() => {
        setSearch(
            searchParams.get("search") || ""
        );
    }, [searchParams]);


    /* =====================================================
       GET PRODUCTS
    ===================================================== */

    useEffect(() => {
        getProducts();
    }, []);


    const getProducts = async () => {
        try {
            const { data } =
                await api.get("/products");

            setProducts(
                Array.isArray(data?.products)
                    ? data.products
                    : []
            );

        } catch (error) {
            console.error(
                "Failed to load products:",
                error
            );

            setProducts([]);
        }
    };


    /* =====================================================
       RESET PAGE WHEN FILTER CHANGES
    ===================================================== */

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        selectedCategory,
        price,
        sortBy,
    ]);


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const categories = [
        "All",
        ...new Set(
            products
                .map(
                    (product) =>
                        product.category?.name
                )
                .filter(Boolean)
        ),
    ];


    /* =====================================================
       FILTER PRODUCTS
    ===================================================== */

    const filteredProducts = products
        .filter((product) => {

            const productName =
                product.name
                    ?.toLowerCase() || "";

            const categoryName =
                product.category?.name
                    ?.toLowerCase() || "";

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            /* SEARCH */

            const matchesSearch =
                productName.includes(
                    searchValue
                ) ||
                categoryName.includes(
                    searchValue
                );


            /* CATEGORY */

            const matchesCategory =
                selectedCategory === "All" ||
                product.category?.name ===
                    selectedCategory;


            /* PRICE */

            const productPrice =
                Number(product.price) || 0;

            const matchesPrice =
                productPrice <= price;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice
            );
        })


        /* =================================================
           SORT
        ================================================= */

        .sort((a, b) => {

            switch (sortBy) {

                case "priceLow":
                    return (
                        Number(a.price || 0) -
                        Number(b.price || 0)
                    );


                case "priceHigh":
                    return (
                        Number(b.price || 0) -
                        Number(a.price || 0)
                    );


                case "name":
                    return (
                        a.name || ""
                    ).localeCompare(
                        b.name || ""
                    );


                case "newest":
                default:
                    return (
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                    );
            }
        });


    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages =
        Math.ceil(
            filteredProducts.length /
                productsPerPage
        );


    const startIndex =
        (currentPage - 1) *
        productsPerPage;


    const endIndex =
        startIndex +
        productsPerPage;


    const currentProducts =
        filteredProducts.slice(
            startIndex,
            endIndex
        );


    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const goToPage = (page) => {

        if (totalPages === 0) {
            return;
        }


        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }


        setCurrentPage(page);


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    return (
        <>
            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                SHOP SECTION
            ================================================= */}

            <section className="products-section shop-page">

                <div className="container">


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="section-title shop-section-title">

                        <h2>
                            This Week's Bestsellers
                        </h2>

                        <p>
                            The most loved pieces
                            from our latest
                            collection.
                        </p>

                    </div>


                    {/* =================================================
                        SHOP LAYOUT
                    ================================================= */}

                    <div className="shop-layout">


                        {/* =================================================
                            FILTER SIDEBAR
                        ================================================= */}

                        <aside className="filter-sidebar">


                            {/* SEARCH */}

                            <div className="search-wrapper">

                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    className="product-search"
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="filter-block">

                                <h4>
                                    Categories
                                </h4>


                                <div className="category-filter">

                                    {categories.map(
                                        (category) => (

                                            <button
                                                key={
                                                    category
                                                }
                                                type="button"
                                                className={`category-btn ${
                                                    selectedCategory ===
                                                    category
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category
                                                    )
                                                }
                                            >
                                                {category}
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* PRICE */}

                            <div className="filter-block">

                                <div className="price-header">

                                    <h4>
                                        Price
                                    </h4>

                                    <span>
                                        ₹
                                        {price.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="100"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                />

                            </div>


                            {/* SORT */}

                            <div className="filter-block">

                                <h4>
                                    Sort By
                                </h4>


                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value
                                        )
                                    }
                                    className="sort-select"
                                >

                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="priceLow">
                                        Price: Low → High
                                    </option>

                                    <option value="priceHigh">
                                        Price: High → Low
                                    </option>

                                    <option value="name">
                                        Name (A–Z)
                                    </option>

                                </select>

                            </div>

                        </aside>


                        {/* =================================================
                            PRODUCTS
                        ================================================= */}

                        <div className="products-content">


                            {currentProducts.length >
                            0 ? (

                                <div className="shop-products-grid">

                                    {currentProducts.map(
                                        (product) => (

                                            <div
                                                className="shop-product-item"
                                                key={
                                                    product._id
                                                }
                                            >

                                                <ProductCard
                                                    product={
                                                        product
                                                    }
                                                />

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="shop-no-products">

                                    <h4>
                                        No products found.
                                    </h4>

                                    <p>
                                        Try changing your
                                        search or filters.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                PAGINATION

                                IMPORTANT:
                                This is ALWAYS rendered.
                            ================================================= */}

                            <div className="pagination">

                                {/* PREVIOUS */}

                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        1 ||
                                        totalPages ===
                                        0
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage -
                                                1
                                        )
                                    }
                                >
                                    Previous
                                </button>


                                {/* PAGE NUMBERS */}

                                {Array.from(
                                    {
                                        length:
                                            Math.max(
                                                totalPages,
                                                1
                                            ),
                                    },
                                    (_, index) => {

                                        const pageNumber =
                                            index + 1;

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    pageNumber
                                                }
                                                className={
                                                    currentPage ===
                                                    pageNumber
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    goToPage(
                                                        pageNumber
                                                    )
                                                }
                                            >
                                                {
                                                    pageNumber
                                                }
                                            </button>
                                        );
                                    }
                                )}


                                {/* NEXT */}

                                <button
                                    type="button"
                                    disabled={
                                        totalPages ===
                                            0 ||
                                        currentPage ===
                                            totalPages
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage +
                                                1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Footer />
        </>
    );
}