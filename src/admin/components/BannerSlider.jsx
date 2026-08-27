import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActiveBanners } from "../services/bannerApi";

export default function BannerSlider() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(
        new Set()
    );

    useEffect(() => {
        let mounted = true;

        const fetchBanners = async () => {
            try {
                const { data } =
                    await getActiveBanners();

                if (!mounted) return;

                const bannerData =
                    Array.isArray(data?.banners)
                        ? data.banners
                        : [];

                setBanners(bannerData);

                if (bannerData.length > 0) {
                    setLoadedImages(
                        new Set([0])
                    );
                }
            } catch (error) {
                if (mounted) {
                    setBanners([]);
                }

                console.error(
                    "Banner Error:",
                    error
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchBanners();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (banners.length <= 1) {
            return undefined;
        }

        const nextIndex =
            activeIndex === banners.length - 1
                ? 0
                : activeIndex + 1;

        setLoadedImages((previous) => {
            if (previous.has(nextIndex)) {
                return previous;
            }

            const updated = new Set(previous);
            updated.add(nextIndex);

            return updated;
        });

        const interval = setInterval(() => {
            setActiveIndex((previous) =>
                previous === banners.length - 1
                    ? 0
                    : previous + 1
            );
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [
        banners.length,
        activeIndex,
    ]);

    const handleSlideChange = (index) => {
        setActiveIndex(index);

        setLoadedImages((previous) => {
            if (previous.has(index)) {
                return previous;
            }

            const updated = new Set(previous);
            updated.add(index);

            return updated;
        });
    };

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
            <div className="souk-banner">
                {banners.map(
                    (banner, index) => {
                        const shouldLoad =
                            loadedImages.has(index);

                        return (
                            <div
                                key={banner._id}
                                className={`souk-banner-slide ${
                                    index === activeIndex
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {shouldLoad && (
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
                                )}

                                <div className="banner-overlay"></div>

                                <div className="banner-bottom-fade"></div>

                                <div className="banner-content">
                                    <div className="banner-eyebrow">
                                        <span className="eyebrow-star">
                                            ✦
                                        </span>

                                        <span>
                                            SOUK FASHION HOUSE
                                        </span>

                                        <span className="eyebrow-line"></span>
                                    </div>

                                    {banner.title && (
                                        <h1 className="banner-title">
                                            {banner.title}
                                        </h1>
                                    )}

                                    {banner.subtitle && (
                                        <p className="banner-subtitle">
                                            {banner.subtitle}
                                        </p>
                                    )}

                                    {banner.buttonLink &&
                                        banner.buttonText && (
                                            <Link
                                                to={
                                                    banner.buttonLink
                                                }
                                                className="banner-button"
                                            >
                                                <span>
                                                    {
                                                        banner.buttonText
                                                    }
                                                </span>

                                                <span className="banner-button-arrow">
                                                    →
                                                </span>
                                            </Link>
                                        )}
                                </div>

                                <div className="banner-vertical-label">
                                    <span>
                                        NEW COLLECTION
                                    </span>
                                </div>
                            </div>
                        );
                    }
                )}

                {banners.length > 1 && (
                    <div className="banner-indicators">
                        {banners.map(
                            (_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${
                                        index + 1
                                    }`}
                                    className={`banner-indicator ${
                                        index ===
                                        activeIndex
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSlideChange(
                                            index
                                        )
                                    }
                                >
                                    <span>
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>

                                    <i></i>
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}