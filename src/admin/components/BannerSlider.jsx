import { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getActiveBanners } from "../services/bannerApi";


export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const { data } = await getActiveBanners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Banner Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <Carousel fade interval={4000} pause={false}>
      {banners.map((banner) => (
        <Carousel.Item key={banner._id}>
          <div
            style={{
              position: "relative",
              height: "600px",
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="d-block w-100"
              style={{
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
                style={{ maxWidth: "650px" }}
              >
                <h1
                  className="display-3 fw-bold mb-3"
                >
                  {banner.title}
                </h1>

                <p className="lead mb-4">
                  {banner.subtitle}
                </p>

                <Link
                  to={banner.buttonLink}
                  className="btn btn-light btn-lg px-5"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}