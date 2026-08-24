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
    Sparkles,
} from "lucide-react";

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
        <section className="new-arrival-section">

            <div className="container new-arrival-container">

                {/* =================================================
                    TOP LINE
                ================================================= */}

                <div className="new-arrival-topline">

                    <span>
                        THE LATEST EDIT
                    </span>

                    <div className="new-arrival-topline-center">
                        <span />
                        NEW SEASON
                        <span />
                    </div>

                    <span>
                        2026 COLLECTION
                    </span>

                </div>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="new-arrival-header">

                    <div className="new-arrival-heading">

                        <span className="new-arrival-eyebrow">
                            JUST DROPPED
                        </span>

                        <h2>
                            New
                            <em> Arrivals</em>
                        </h2>

                        <div className="new-arrival-title-line">
                            <span />
                            <span />
                        </div>

                    </div>


                    <div className="new-arrival-copy">

                        <p>
                            Discover the latest pieces added to our
                            collection — refined silhouettes, considered
                            fabrics and effortless style for the season ahead.
                        </p>

                        <Link
                            to="/shop"
                            className="new-arrival-explore"
                        >
                            <span>EXPLORE NEW</span>

                            <span className="new-arrival-explore-icon">
                                <ArrowUpRight size={17} />
                            </span>
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    COLLECTION NOTE
                ================================================= */}

                <div className="new-arrival-note">

                    <div className="new-arrival-note-icon">
                        <Sparkles size={16} />
                    </div>

                    <div>
                        <strong>
                            FRESH FROM THE HOUSE
                        </strong>

                        <span>
                            Newly selected pieces, carefully curated for you.
                        </span>
                    </div>

                </div>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {products.length > 0 && (
                    <div className="new-arrival-products">

                        <div className="new-arrival-slider">

                            {/* PREVIOUS */}

                            <button
                                ref={prevRef}
                                type="button"
                                className="new-arrival-arrow new-arrival-prev"
                                aria-label="Previous products"
                            >
                                <span>←</span>
                            </button>


                            {/* SWIPER */}

                            <Swiper
                                modules={[Navigation]}

                                className="new-arrival-swiper"

                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}

                                speed={650}

                                grabCursor={true}

                                slidesPerGroup={1}

                                loop={products.length > 4}

                                breakpoints={{

                                    0: {
                                        slidesPerView: 1,
                                        slidesPerGroup: 1,
                                        spaceBetween: 15,
                                    },

                                    480: {
                                        slidesPerView: 1,
                                        slidesPerGroup: 1,
                                        spaceBetween: 17,
                                    },

                                    576: {
                                        slidesPerView: 2,
                                        slidesPerGroup: 1,
                                        spaceBetween: 19,
                                    },

                                    768: {
                                        slidesPerView: 3,
                                        slidesPerGroup: 1,
                                        spaceBetween: 21,
                                    },

                                    992: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 1,
                                        spaceBetween: 22,
                                    },

                                    1200: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 1,
                                        spaceBetween: 24,
                                    },

                                    1400: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 1,
                                        spaceBetween: 22,
                                    },
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
                            >

                                {products.map((product, index) => (
                                    <SwiperSlide key={product._id}>

                                        <div className="new-arrival-product">

                                            <span className="new-arrival-number">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <ProductCard
                                                product={product}
                                                showWishlistButton={true}
                                            />

                                        </div>

                                    </SwiperSlide>
                                ))}

                            </Swiper>


                            {/* NEXT */}

                            <button
                                ref={nextRef}
                                type="button"
                                className="new-arrival-arrow new-arrival-next"
                                aria-label="Next products"
                            >
                                <span>→</span>
                            </button>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="new-arrival-footer">

                            <div />

                            <span>
                                NEW SEASON · NEW PERSPECTIVE
                            </span>

                            <div />

                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}