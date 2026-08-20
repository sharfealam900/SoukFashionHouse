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

            console.log("Best Seller Products:", data.products);

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
            <div className="container">

                {/* =========================
                    SECTION HEADER
                ========================= */}

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

                         <div className="best-sellers-benefits">

                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <Star size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Top Rated
                                    </strong>

                                    <span>
                                        Loved by customers
                                    </span>
                                </div>
                            </div>

                            <div className="benefit-divider" />

                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <Leaf size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Premium Quality
                                    </strong>

                                    <span>
                                        Finest materials
                                    </span>
                                </div>
                            </div>

                            <div className="benefit-divider" />

                            <div className="benefit-item">
                                <div className="benefit-icon">
                                    <LockKeyhole size={21} />
                                </div>

                                <div>
                                    <strong>
                                        Secure Shopping
                                    </strong>

                                    <span>
                                        Safe & protected
                                    </span>
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

                        {/* PREVIOUS BUTTON */}

                        <button
                            ref={prevRef}
                            type="button"
                            className="slider-btn prev"
                            aria-label="Previous products"
                        >
                            &#10094;
                        </button>


                        {/* SWIPER */}

                        <Swiper
                            modules={[Navigation]}

                            spaceBetween={30}

                            slidesPerView={4}

                            slidesPerGroup={1}

                            speed={600}

                            loop={products.length > 4}

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
                                    slidesPerGroup: 1,
                                    spaceBetween: 16,
                                },

                                /* Small mobile */

                                480: {
                                    slidesPerView: 1,
                                    slidesPerGroup: 1,
                                    spaceBetween: 18,
                                },

                                /* Tablet */

                                576: {
                                    slidesPerView: 2,
                                    slidesPerGroup: 1,
                                    spaceBetween: 20,
                                },

                                /* Small desktop */

                                768: {
                                    slidesPerView: 3,
                                    slidesPerGroup: 1,
                                    spaceBetween: 24,
                                },

                                /* Desktop */

                                1200: {
                                    slidesPerView: 4,
                                    slidesPerGroup: 1,
                                    spaceBetween: 30,
                                },
                            }}
                        >

                            {products.map((product) => (
                                <SwiperSlide
                                    key={product._id}
                                >
                                    <ProductCard
                                        product={product}
                                        showWishlistButton={true}
                                    />
                                </SwiperSlide>
                            ))}

                        </Swiper>


                        {/* NEXT BUTTON */}

                        <button
                            ref={nextRef}
                            type="button"
                            className="slider-btn next"
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