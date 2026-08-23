import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActiveBanners } from "../services/bannerApi";

export default function BannerSlider() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await getActiveBanners();
                setBanners(data.banners || []);
            } catch (error) {
                console.error("Banner Error:", error);
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    /* =========================
       AUTO SLIDE
    ========================== */
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    /* =========================
       LOADING
    ========================== */
    if (loading) {
        return (
            <div className="banner-loading">
                <div className="banner-loader"></div>
            </div>
        );
    }

    if (!banners.length) {
        return null;
    }

    return (
        <section className="souk-banner-section">

            {/* =====================================
                HERO BANNER
            ====================================== */}
            <div className="souk-banner">

                {banners.map((banner, index) => (
                    <div
                        key={banner._id}
                        className={`souk-banner-slide ${
                            index === activeIndex ? "active" : ""
                        }`}
                    >

                        {/* IMAGE */}
                        <img
                            src={banner.image}
                            alt={
                                banner.title ||
                                "Souk Fashion House"
                            }
                            className="souk-banner-image"
                            loading={
                                index === 0
                                    ? "eager"
                                    : "lazy"
                            }
                            fetchPriority={
                                index === 0
                                    ? "high"
                                    : "low"
                            }
                            decoding="async"
                        />

                        {/* DARK GRADIENT */}
                        <div className="banner-overlay"></div>

                        {/* BOTTOM FADE */}
                        <div className="banner-bottom-fade"></div>

                        {/* =================================
                            CONTENT
                        ================================== */}
                        <div className="banner-content">

                            {/* BRAND LABEL */}
                            <div className="banner-eyebrow">

                                <span className="eyebrow-star">
                                    ✦
                                </span>

                                <span>
                                    SOUK FASHION HOUSE
                                </span>

                                <span className="eyebrow-line"></span>

                            </div>

                            {/* TITLE */}
                            {banner.title && (
                                <h1 className="banner-title">
                                    {banner.title}
                                </h1>
                            )}

                            {/* SUBTITLE */}
                            {banner.subtitle && (
                                <p className="banner-subtitle">
                                    {banner.subtitle}
                                </p>
                            )}

                            {/* BUTTON */}
                            {banner.buttonLink &&
                                banner.buttonText && (
                                    <Link
                                        to={banner.buttonLink}
                                        className="banner-button"
                                    >
                                        <span>
                                            {banner.buttonText}
                                        </span>

                                        <span className="banner-button-arrow">
                                            →
                                        </span>
                                    </Link>
                                )}

                        </div>

                        {/* =================================
                            VERTICAL LABEL
                        ================================== */}
                        <div className="banner-vertical-label">
                            <span>
                                NEW COLLECTION
                            </span>
                        </div>

                    </div>
                ))}

                {/* =====================================
                    SLIDE INDICATORS
                ====================================== */}
                {banners.length > 1 && (
                    <div className="banner-indicators">

                        {banners.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                aria-label={`Go to slide ${
                                    index + 1
                                }`}
                                className={`banner-indicator ${
                                    index === activeIndex
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveIndex(index)
                                }
                            >
                                <span>
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <i></i>
                            </button>
                        ))}

                    </div>
                )}

            </div>


        </section>
    );
}