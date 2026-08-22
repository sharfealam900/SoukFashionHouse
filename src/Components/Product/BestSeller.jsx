import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import api from "../../api/axios";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

import { Leaf, LockKeyhole, Star } from "lucide-react";

export default function BestSeller() {
    const [products, setProducts] = useState([]);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const { data } = await api.get("/products/best-sellers");

            setProducts(data.products || []);
        } catch (error) {
            console.error(
                "Best Seller Error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <section className="products-section best-seller-section">
            <div className="container best-seller-container">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="premium-section-header">

                    <div className="premium-heading">

                        <span className="section-label">
                            OUR COLLECTION
                        </span>

                        <h2>Best Sellers</h2>

                        <p>
                            Discover timeless fashion pieces loved by our
                            customers. Carefully curated designs that blend
                            elegance, comfort, and everyday style.
                        </p>

                        {/* BENEFITS */}

                        <div className="best-sellers-benefits">

                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    <Star size={20} strokeWidth={1.8} />
                                </div>

                                <div className="benefit-content">
                                    <strong>Top Rated</strong>
                                    <span>Loved by customers</span>
                                </div>

                            </div>


                            <div className="benefit-divider" />


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    <Leaf size={20} strokeWidth={1.8} />
                                </div>

                                <div className="benefit-content">
                                    <strong>Premium Quality</strong>
                                    <span>Finest materials</span>
                                </div>

                            </div>


                            <div className="benefit-divider" />


                            <div className="benefit-item">

                                <div className="benefit-icon">
                                    <LockKeyhole
                                        size={20}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div className="benefit-content">
                                    <strong>Secure Shopping</strong>
                                    <span>Safe & protected</span>
                                </div>

                            </div>

                        </div>

                    </div>


                    <Link
                        to="/shop"
                        className="premium-view-btn"
                    >
                        View Collection →
                    </Link>

                </div>


                {/* =========================
                    PRODUCT SLIDER
                ========================= */}

                {products.length > 0 && (
                    <div className="best-seller-slider">

                        {/* PREVIOUS */}

                        <button
                            ref={prevRef}
                            type="button"
                            className="slider-btn prev best-seller-nav-arrow"
                            aria-label="Previous products"
                        >
                            &#10094;
                        </button>


                        <Swiper
                            modules={[Navigation]}

                            className="best-seller-swiper"

                            speed={600}

                            slidesPerGroup={1}

                            loop={products.length > 5}

                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}

                            onSwiper={(swiper) => {
                                setTimeout(() => {
                                    if (
                                        !swiper.navigation ||
                                        !prevRef.current ||
                                        !nextRef.current
                                    ) {
                                        return;
                                    }

                                    swiper.params.navigation.prevEl =
                                        prevRef.current;

                                    swiper.params.navigation.nextEl =
                                        nextRef.current;

                                    swiper.navigation.destroy();
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }, 100);
                            }}

                            breakpoints={{

                                /* Mobile */

                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 14,
                                },

                                /* Large mobile */

                                480: {
                                    slidesPerView: 1,
                                    spaceBetween: 16,
                                },

                                /* Tablet */

                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 18,
                                },

                                /* Small desktop */

                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },

                                /* Desktop */

                                992: {
                                    slidesPerView: 4,
                                    spaceBetween: 22,
                                },

                                /* Large desktop */

                                1200: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },

                                /* Wide desktop */

                                1400: {
                                    slidesPerView: 5,
                                    spaceBetween: 16,
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


                        {/* NEXT */}

                        <button
                            ref={nextRef}
                            type="button"
                            className="slider-btn next best-seller-nav-arrow"
                            aria-label="Next products"
                        >
                            &#10095;
                        </button>

                    </div>
                )}

            </div>
        </section>
    );
}