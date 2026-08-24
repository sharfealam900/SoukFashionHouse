import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import api from "../../api/axios";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

import {
    ArrowUpRight,
    Leaf,
    LockKeyhole,
    Star,
} from "lucide-react";

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
        <section className="best-seller-section">

            <div className="container best-seller-container">

                {/* ==========================================
                    INTRO
                ========================================== */}

                <div className="best-seller-intro">

                    <div className="best-seller-heading">

                        <span className="best-seller-eyebrow">
                            THE MOST LOVED
                        </span>

                        <h2>
                            Best Sellers
                        </h2>

                        <div className="best-seller-heading-line" />

                    </div>


                    <div className="best-seller-description">

                        <p>
                            Discover the pieces our customers return
                            to again and again — timeless silhouettes
                            designed for effortless everyday elegance.
                        </p>

                        <Link
                            to="/shop"
                            className="best-seller-link"
                        >
                            <span>View Collection</span>

                            <span className="best-seller-link-arrow">
                                <ArrowUpRight size={16} />
                            </span>
                        </Link>

                    </div>

                </div>


                {/* ==========================================
                    BENEFITS
                ========================================== */}

                <div className="best-seller-benefits">

                    <div className="best-seller-benefit">

                        <div className="best-seller-benefit-icon">
                            <Star size={17} />
                        </div>

                        <div>
                            <strong>Top Rated</strong>
                            <span>Loved by our customers</span>
                        </div>

                    </div>


                    <div className="best-seller-benefit-divider" />


                    <div className="best-seller-benefit">

                        <div className="best-seller-benefit-icon">
                            <Leaf size={17} />
                        </div>

                        <div>
                            <strong>Premium Quality</strong>
                            <span>Thoughtfully selected materials</span>
                        </div>

                    </div>


                    <div className="best-seller-benefit-divider" />


                    <div className="best-seller-benefit">

                        <div className="best-seller-benefit-icon">
                            <LockKeyhole size={17} />
                        </div>

                        <div>
                            <strong>Secure Shopping</strong>
                            <span>Safe & protected checkout</span>
                        </div>

                    </div>

                </div>


                {/* ==========================================
                    PRODUCTS
                ========================================== */}

                {products.length > 0 && (
                    <div className="best-seller-products">

                        <div className="best-seller-slider">

                            {/* PREVIOUS */}

                            <button
                                ref={prevRef}
                                type="button"
                                className="best-seller-arrow best-seller-prev"
                                aria-label="Previous products"
                            >
                                <span>←</span>
                            </button>


                            {/* SWIPER */}

                            <Swiper
                                modules={[Navigation]}
                                className="best-seller-swiper"
                                speed={650}
                                slidesPerGroup={1}
                                loop={products.length > 5}
                                grabCursor={true}
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
                                    0: {
                                        slidesPerView: 1,
                                        spaceBetween: 14,
                                    },

                                    480: {
                                        slidesPerView: 1,
                                        spaceBetween: 16,
                                    },

                                    576: {
                                        slidesPerView: 2,
                                        spaceBetween: 18,
                                    },

                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },

                                    992: {
                                        slidesPerView: 4,
                                        spaceBetween: 22,
                                    },

                                    1200: {
                                        slidesPerView: 4,
                                        spaceBetween: 22,
                                    },

                                    1400: {
                                        slidesPerView: 4,
                                        spaceBetween: 20,
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
                                className="best-seller-arrow best-seller-next"
                                aria-label="Next products"
                            >
                                <span>→</span>
                            </button>

                        </div>


                        {/* ==================================
                            FOOTER
                        ================================== */}

                        <div className="best-seller-footer">

                            <span className="best-seller-footer-line" />

                            <span>
                                CURATED WITH INTENTION
                            </span>

                            <span className="best-seller-footer-line" />

                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}