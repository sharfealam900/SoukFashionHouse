import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import api from "../../api/axios";
import ProductCard from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

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
                            Discover timeless fashion pieces loved by our customers.
                            Carefully curated designs that blend elegance, comfort,
                            and everyday style.
                        </p>

                    </div>

                    <Link
                        to="/shop"
                        className="premium-view-btn"
                    >
                        View Collection →
                    </Link>

                </div>

                <div className="best-seller-slider">
                    <button ref={prevRef} className="slider-btn prev">
                        &#10094;
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onSwiper={(swiper) => {
                            setTimeout(() => {
                                if (!swiper.navigation) return;

                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;

                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            });
                        }}
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

                    <button ref={nextRef} className="slider-btn next">
                        &#10095;
                    </button>
                </div>


            </div>
        </section>
    );
}