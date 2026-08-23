import { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getActiveBanners } from "../services/bannerApi";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "600px",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <Carousel fade interval={4000} pause={false}>
      {banners.map((banner, index) => (
        <Carousel.Item key={banner._id}>
          <div
            style={{
              position: "relative",
              height: "600px",
            }}
          >
            <img
              src={banner.image}
              alt={banner.title || "Banner"}
              className="d-block w-100"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              style={{
                width: "100%",
                height: "600px",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="container text-white"
                style={{
                  maxWidth: "650px",
                }}
              >
                <h1 className="display-3 fw-bold mb-3">
                  {banner.title}
                </h1>

                <p className="lead mb-4">
                  {banner.subtitle}
                </p>

                {banner.buttonLink && banner.buttonText && (
                  <Link
                    to={banner.buttonLink}
                    className="btn btn-light btn-lg px-5"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}