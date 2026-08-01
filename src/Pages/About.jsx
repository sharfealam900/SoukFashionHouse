import React from "react";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


import heroImg from "../assets/about/hero.jpg";
import storyImg from "../assets/about/story.jpg";
import kurtiImg from "../assets/about/kurti.jpg";
import shawlImg from "../assets/about/shawl.jpg";
import hijabImg from "../assets/about/hijab.jpg";
import coordImg from "../assets/about/coordset.jpg";
import { Link } from "react-router-dom";


export default function About() {
  const collections = [
    {
      title: "Kashmiri Ari Work Kurtis",
      image: kurtiImg,
      text: "Beautiful handcrafted embroidery with premium fabrics designed for elegance and everyday comfort.",
    },
    {
      title: "Premium Shawls",
      image: shawlImg,
      text: "Soft, elegant shawls inspired by timeless Kashmiri craftsmanship for every season.",
    },
    {
      title: "Elegant Hijabs",
      image: hijabImg,
      text: "Comfortable, lightweight and graceful hijabs that perfectly complement modest fashion.",
    },
    {
      title: "Co-Ord Sets",
      image: coordImg,
      text: "Modern coordinated outfits designed with premium materials and beautiful embroidery.",
    },
  ];

  const values = [
    {
      icon: <Sparkles size={32} />,
      title: "Premium Craftsmanship",
      text: "Every design reflects fine embroidery and attention to detail.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Trusted Quality",
      text: "Carefully selected fabrics for lasting comfort and elegance.",
    },
    {
      icon: <Truck size={32} />,
      title: "Pan India Delivery",
      text: "Reliable shipping across India with secure packaging.",
    },
    {
      icon: <BadgeCheck size={32} />,
      title: "Customer First",
      text: "Dedicated support to ensure a smooth shopping experience.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* HERO */}

        <section className="about-hero">

          <img
            src={kurtiImg}
            alt="SOUK Fashion"
            className=""
          />

      

          <div className="container hero-content">

            <span className="hero-subtitle">
              SOUK FASHION HOUSE
            </span>

            <h1>
              Timeless Kashmiri Elegance
              <br />
              Crafted For Every Woman
            </h1>

            <p className="text-black">
              Discover premium Kashmiri Ari Work Kurtis,
              elegant shawls, stylish hijabs and modest
              fashion designed to celebrate tradition,
              comfort and timeless beauty.
            </p>

            <Link
              to="/shop"
              className="about-btn"
            >
              Shop Collection

              <ArrowRight size={18} />

            </Link>

          </div>

        </section>

        {/* STORY */}

        <section className="about-story">

          <div className="container">

            <div className="row align-items-center g-5">

              <div className="col-lg-6">

                <img
                  src={storyImg}
                  alt="Our Story"
                  className="img-fluid rounded-4 shadow"
                />

              </div>

              <div className="col-lg-6">

                <span className="section-tag">
                  OUR STORY
                </span>

                <h2>
                  Inspired By Heritage,
                  Designed For Today
                </h2>

                <p>

                  SOUK Fashion House was founded with
                  a vision to bring the timeless beauty
                  of Kashmiri craftsmanship to modern
                  women.

                </p>

                <p>

                  Every kurti, shawl and hijab in our
                  collection is carefully selected to
                  combine premium quality, intricate
                  embroidery and comfortable fabrics
                  suitable for daily wear and special
                  occasions alike.

                </p>

                <p>

                  We believe fashion should reflect
                  confidence, elegance and individuality,
                  allowing every woman to express her
                  unique style.

                </p>

              </div>

            </div>

          </div>

        </section>

        {/* COLLECTIONS */}

        <section className="collections-section">

          <div className="container">

            <div className="section-heading">

              <span>OUR COLLECTIONS</span>

              <h2>
                Discover Signature Pieces
              </h2>

              <p>

                Premium handcrafted collections designed
                for elegance, comfort and timeless fashion.

              </p>

            </div>

            <div className="row g-4">

              {collections.map((item, index) => (

                <div
                  className="col-lg-3 col-md-6"
                  key={index}
                >

                  <div className="collection-card">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div className="collection-content">

                      <h4>
                        {item.title}
                      </h4>

                      <p>
                        {item.text}
                      </p>

                      <Link
                        to="/shop"
                        className="collection-link"
                      >

                        Explore

                        <ArrowRight size={16} />

                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>
                {/* WHY CHOOSE US */}

        <section className="about-values">

          <div className="container">

            <div className="section-heading">

              <span>WHY CHOOSE SOUK</span>

              <h2>
                Crafted With Passion,
                Designed With Elegance
              </h2>

              <p>
                Every collection reflects our commitment
                to premium craftsmanship, elegant designs,
                and exceptional customer experience.
              </p>

            </div>

            <div className="row g-4">

              {values.map((item, index) => (

                <div
                  className="col-lg-3 col-md-6"
                  key={index}
                >

                  <div className="value-card">

                    <div className="value-icon">

                      {item.icon}

                    </div>

                    <h4>

                      {item.title}

                    </h4>

                    <p>

                      {item.text}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* PREMIUM FABRICS */}

        <section className="fabric-section">

          <div className="container">

            <div className="row align-items-center g-5">

              <div className="col-lg-6">

                <img
                  src={kurtiImg}
                  alt="Premium Fabric"
                  className="img-fluid rounded-4 shadow"
                />

              </div>

              <div className="col-lg-6">

                <span className="section-tag">

                  PREMIUM FABRICS

                </span>

                <h2>

                  Luxury You Can Feel

                </h2>

                <p>

                  Every SOUK collection is created using
                  carefully selected premium fabrics,
                  offering softness, durability and
                  unmatched comfort.

                </p>

                <ul className="fabric-list">

                  <li>
                    ✔ Premium Ruby Cotton
                  </li>

                  <li>
                    ✔ Kashmiri Ari Embroidery
                  </li>

                  <li>
                    ✔ Lightweight Summer Fabrics
                  </li>

                  <li>
                    ✔ Elegant Everyday Wear
                  </li>

                  <li>
                    ✔ Soft & Comfortable Hijab Fabric
                  </li>

                  <li>
                    ✔ Beautiful Shawls For Every Season
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </section>

        {/* GALLERY */}

      <section className="gallery-section">
  <div className="container">

    <div className="section-heading">
      <span>OUR GALLERY</span>
      <h2>Signature Collections</h2>
    </div>

    <div className="row g-4">

      <div className="col-lg-4 col-md-6">
        <img src={kurtiImg} className="gallery-img" />
      </div>

      <div className="col-lg-4 col-md-6">
        <img src={shawlImg} className="gallery-img" />
      </div>

      <div className="col-lg-4 col-md-6">
        <img src={hijabImg} className="gallery-img" />
      </div>

      <div className="col-lg-4 col-md-6">
        <img src={coordImg} className="gallery-img" />
      </div>

      <div className="col-lg-4 col-md-6">
        <img src={storyImg} className="gallery-img" />
      </div>

      <div className="col-lg-4 col-md-6">
        <img src={heroImg} className="gallery-img" />
      </div>

    </div>

  </div>
</section>
        {/* PROMISE */}

        <section className="promise-section">

          <div className="container">

            <div className="section-heading">

              <span>OUR PROMISE</span>

              <h2>

                More Than Fashion

              </h2>

            </div>

            <div className="row g-4">

              <div className="col-md-4">

                <div className="promise-card">

                  <h4>

                    Premium Quality

                  </h4>

                  <p>

                    Every product is inspected to ensure
                    exceptional craftsmanship and premium
                    finishing.

                  </p>

                </div>

              </div>

              <div className="col-md-4">

                <div className="promise-card">

                  <h4>

                    Secure Shopping

                  </h4>

                  <p>

                    Safe payments, secure checkout and
                    reliable delivery across India.

                  </p>

                </div>

              </div>

              <div className="col-md-4">

                <div className="promise-card">

                  <h4>

                    Customer Satisfaction

                  </h4>

                  <p>

                    Dedicated support before and after
                    every purchase.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>
                {/* BRAND MISSION */}

        <section className="mission-section">

          <div className="container">

            <div className="row align-items-center g-5">

              <div className="col-lg-6">

                <span className="section-tag">
                  OUR MISSION
                </span>

                <h2>
                  Bringing Timeless Elegance
                  To Every Wardrobe
                </h2>

                <p>
                  At SOUK Fashion House, our mission is to
                  celebrate the beauty of traditional
                  craftsmanship while embracing modern
                  fashion. We believe every woman deserves
                  clothing that is elegant, comfortable,
                  and made with exceptional attention to
                  detail.
                </p>

                <p>
                  From beautifully embroidered Kashmiri
                  Ari Work Kurtis to premium shawls,
                  stylish hijabs and elegant co-ord sets,
                  every collection is carefully curated to
                  offer timeless fashion for every
                  occasion.
                </p>

              </div>

              <div className="col-lg-6">

                <img
                  src={kurtiImg}
                  alt="Mission"
                  className="img-fluid rounded-4 shadow"
                />

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="features-section">

          <div className="container">

            <div className="row g-4">

              <div className="col-md-3">

                <div className="feature-box">

                  <Truck
                    size={42}
                    className="feature-icon"
                  />

                  <h4>Pan India Delivery</h4>

                  <p>
                    Fast and reliable shipping across India.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="feature-box">

                  <ShieldCheck
                    size={42}
                    className="feature-icon"
                  />

                  <h4>Secure Shopping</h4>

                  <p>
                    Safe payments with trusted checkout.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="feature-box">

                  <BadgeCheck
                    size={42}
                    className="feature-icon"
                  />

                  <h4>Premium Quality</h4>

                  <p>
                    Carefully selected fabrics and
                    craftsmanship.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="feature-box">

                  <Sparkles
                    size={42}
                    className="feature-icon"
                  />

                  <h4>Latest Collections</h4>

                  <p>
                    Fresh arrivals inspired by timeless
                    fashion.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="about-cta">

          <div className="container">

            <div className="cta-box">

              <span className="section-tag">

                DISCOVER SOUK

              </span>

              <h2>

                Find Your Perfect Style Today

              </h2>

              <p>

                Explore our exclusive collection of
                Kashmiri Ari Work Kurtis, Premium
                Shawls, Elegant Hijabs and Co-Ord Sets
                crafted with premium fabrics and timeless
                elegance.

              </p>

              <Link
                to="/shop"
                className="about-bottom"
              >

                Shop Collection

                <ArrowRight size={18} />

              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}