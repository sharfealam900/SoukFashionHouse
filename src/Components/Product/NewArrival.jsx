import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "./ProductCard";

export default function NewArrival() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const { data } = await api.get("/products/new-arrivals");
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="products-section new-arrival-section">
            <div className="container">

                {/* Section Header */}

                <div className="premium-section-header">

                    <div className="premium-heading">

                        <span className="section-label new-label">
                            JUST DROPPED
                        </span>

                        <h2>
                            New Arrivals
                        </h2>

                        <p>
                            Explore our newest arrivals featuring modern
                            silhouettes, premium fabrics, and styles crafted
                            for every occasion.
                        </p>

                    </div>

                    <Link
                        to="/shop"
                        className="premium-view-btn"
                    >
                        Explore New →
                    </Link>

                </div>

                {/* Products */}

                <div className="row g-4">

                    {products.map((product) => (

                        <div
                            className="col-xl-3 col-lg-4 col-md-6"
                            key={product._id}
                        >
                            <ProductCard product={product} />
                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}