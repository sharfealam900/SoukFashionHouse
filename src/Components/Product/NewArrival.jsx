import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import api from "../../api/axios";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

export default function NewArrival() {
    const [products, setProducts] = useState([]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const { data } = await api.get("/products/new-arrivals");
            setProducts(data.products || []);
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
                            silhouettes, premium fabrics and styles crafted
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

                {/* Slider */}

                <div className="best-seller-slider">

                    <button
                        ref={prevRef}
                        className="slider-btn prev"
                    >
                        &#10094;
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        navigation={true}
                        spaceBetween={30}
                        slidesPerView={4}
                        slidesPerGroup={4}
                        speed={600}
                        loop={products.length > 4}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                            },
                            576: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            768: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                            },
                            1200: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                            },
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id}>
                                <ProductCard
                                    product={product}
                                    showWishlistButton={true}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        ref={nextRef}
                        className="slider-btn next"
                    >
                        &#10095;
                    </button>

                </div>

            </div>
        </section>
    );
}