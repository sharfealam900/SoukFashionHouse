import React, { useEffect, useState } from "react";

import api from "../api/axios";
import ProductCard from "../Components/Product/ProductCard";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useSearchParams } from "react-router-dom";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [price, setPrice] = useState(100000);
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    const [search, setSearch] = useState(
        searchParams.get("search") || "");



    useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);



    useEffect(() => {
        getProducts();
    }, []);


    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategory, price, sortBy]);


    const getProducts = async () => {
        try {
            const { data } = await api.get("/products");
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    const categories = [
        "All",
        ...new Set(
            products
                .map((product) => product.category?.name)
                .filter(Boolean)
        ),
    ];

    const filteredProducts = products
        .filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.category?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                product.category?.name === selectedCategory;

            const matchesPrice = product.price <= price;

            return matchesSearch && matchesCategory && matchesPrice;
        })


        .sort((a, b) => {
            switch (sortBy) {
                case "priceLow":
                    return a.price - b.price;

                case "priceHigh":
                    return b.price - a.price;

                case "name":
                    return a.name.localeCompare(b.name);

                case "newest":
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    const currentProducts = filteredProducts.slice(startIndex, endIndex);


    return (
        <>
            <Navbar />
            <section className="products-section">
                <div className="container">

                    <div className="section-title">
                        <h2>This Week's Bestsellers</h2>

                        <p>
                            The most loved pieces from our latest collection.
                        </p>
                    </div>

                    <div className="shop-layout">

                        {/* ================= FILTER SIDEBAR ================= */}

                        <aside className="filter-sidebar">

                            {/* Search */}
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="product-search"
                                />
                            </div>

                            {/* Category */}
                            <div className="filter-block">
                                <h4>Categories</h4>

                                <div className="category-filter">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`category-btn ${selectedCategory === category ? "active" : ""
                                                }`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="filter-block">

                                <div className="price-header">
                                    <h4>Price</h4>
                                    <span>₹{price}</span>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="100"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                />

                            </div>


                            <div className="filter-block">
                                <h4>Sort By</h4>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select">
                                    <option value="newest">Newest</option>
                                    <option value="priceLow">Price: Low → High</option>
                                    <option value="priceHigh">Price: High → Low</option>
                                    <option value="name">Name (A–Z)</option>
                                </select>
                            </div>

                        </aside>

                        {/* ================= PRODUCTS ================= */}

                        <div className="products-content">

                            <div className="row g-4">
                                {filteredProducts.length > 0 ? (
                                    currentProducts.map((product) => (
                                        <div
                                            className="col-lg-4 col-md-6"
                                            key={product._id}
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5">
                                        <h4>No products found.</h4>
                                    </div>
                                )}
                            </div>


                            <div className="pagination">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    Previous
  </button>

  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      className={currentPage === index + 1 ? "active" : ""}
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>

                        </div>

                    </div>

                </div>
            </section>
            <Footer />
        </>
    );
}