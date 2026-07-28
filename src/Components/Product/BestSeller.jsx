import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "./ProductCard";

export default function BestSeller() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const { data } = await api.get("/products/best-sellers");
            setProducts(data.products);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="products-section best-seller-section">
            <div className="container">

                {/* Section Header */}

                <div className="premium-section-header">

                    <div className="premium-heading">

                        <span className="section-label">
                            OUR COLLECTION
                        </span>

                        <h2>
                            Best Sellers
                        </h2>

                        <p>
                            Discover timeless fashion pieces loved by our
                            customers. Carefully curated designs that blend
                            elegance, comfort, and everyday style.
                        </p>

                    </div>

                    <Link
                        to="/shop"
                        className="premium-view-btn"
                    >
                        View Collection →
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