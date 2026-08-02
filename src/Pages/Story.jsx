import React from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    Heart,
    ShieldCheck,
    Truck,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Story() {
    return (
        <>
            <Navbar />

            <main className="story-page">

                {/* ================= Hero ================= */}

                <section className="story-hero">

                    <div className="story-overlay"></div>

                    <div className="container story-hero-content">

                        <span className="story-tag">
                            OUR STORY
                        </span>

                        <h1>
                            Crafted With Passion.
                            <br />
                            Designed For You.
                        </h1>

                        <p>
                            Every collection at SOUK Fashion House is inspired by
                            timeless elegance, premium craftsmanship, and the beauty
                            of modern Indian fashion.
                        </p>

                        <Link
                            to="/shop"
                            className="story-btn"
                        >
                            Explore Collection
                        </Link>

                    </div>

                </section>

                {/* ================= Story ================= */}

                <section className="story-section">

                    <div className="container story-grid">

                        <div className="story-image">

                            <img
                                src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=900"
                                alt="Kashmiri Shawl"
                            />

                        </div>

                        <div className="story-content">

                            <span>
                                OUR JOURNEY
                            </span>

                            <h2>
                                Fashion That Speaks
                                Confidence
                            </h2>

                            <p>
                                SOUK Fashion House began with a simple vision—
                                to bring premium ethnic and contemporary fashion
                                together under one destination.
                            </p>

                            <p>
                                We carefully curate every shawl, saree, suit and
                                fashion piece with attention to quality, comfort,
                                elegance and timeless style.
                            </p>

                            <p>
                                Our collections are designed for women who appreciate
                                graceful fashion while embracing modern trends.
                            </p>

                        </div>

                    </div>

                </section>

                {/* ================= Mission ================= */}

                <section className="mission-section">

                    <div className="container">

                        <div className="section-heading">

                            <span>
                                OUR VALUES
                            </span>

                            <h2>
                                What Makes SOUK Different
                            </h2>

                        </div>

                        <div className="mission-grid">

                            <div className="mission-card">

                                <Sparkles size={40} />

                                <h3>
                                    Premium Quality
                                </h3>

                                <p>
                                    Every product is carefully selected using premium
                                    fabrics and exceptional craftsmanship.
                                </p>

                            </div>

                            <div className="mission-card">

                                <Heart size={40} />

                                <h3>
                                    Made With Love
                                </h3>

                                <p>
                                    Fashion isn't just clothing—it's confidence,
                                    personality and self-expression.
                                </p>

                            </div>

                            <div className="mission-card">

                                <ShieldCheck size={40} />

                                <h3>
                                    Trusted Shopping
                                </h3>

                                <p>
                                    Secure payments, authentic products and customer
                                    satisfaction are our highest priorities.
                                </p>

                            </div>

                            <div className="mission-card">

                                <Truck size={40} />

                                <h3>
                                    Fast Delivery
                                </h3>

                                <p>
                                    We deliver premium fashion quickly across India
                                    with reliable shipping partners.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= Timeline ================= */}

                <section className="timeline-section">

                    <div className="container">

                        <div className="section-heading">

                            <span>OUR JOURNEY</span>

                            <h2>How We Grew</h2>

                        </div>

                        <div className="timeline">

                            <div className="timeline-item">

                                <div className="timeline-year">
                                    2024
                                </div>

                                <div className="timeline-content">

                                    <h3>
                                        The Beginning
                                    </h3>

                                    <p>
                                        SOUK Fashion House started with a vision to
                                        provide premium ethnic and contemporary
                                        fashion that reflects elegance, quality,
                                        and timeless beauty.
                                    </p>

                                </div>

                            </div>

                            <div className="timeline-item">

                                <div className="timeline-year">
                                    2025
                                </div>

                                <div className="timeline-content">

                                    <h3>
                                        Expanding Our Collection
                                    </h3>

                                    <p>
                                        We introduced carefully curated shawls,
                                        sarees, suits, and premium apparel while
                                        building long-lasting relationships with
                                        skilled artisans and trusted suppliers.
                                    </p>

                                </div>

                            </div>

                            <div className="timeline-item">

                                <div className="timeline-year">
                                    2026
                                </div>

                                <div className="timeline-content">

                                    <h3>
                                        Serving Customers Nationwide
                                    </h3>

                                    <p>
                                        Today, SOUK proudly delivers premium fashion
                                        across India, offering secure shopping,
                                        excellent customer support, and fast delivery.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= Gallery ================= */}

                <section className="story-gallery">

                    <div className="container">

                        <div className="section-heading">

                            <span>OUR COLLECTION</span>

                            <h2>Inspired By Elegance</h2>

                        </div>

                        <div className="gallery-grid">

                            <div className="gallery-item">

                                <img
                                    src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=900"
                                    alt="Luxury Shawl"
                                />

                            </div>

                            <div className="gallery-item">

                                <img
                                    src="https://images.pexels.com/photos/18264707/pexels-photo-18264707.jpeg?auto=compress&cs=tinysrgb&w=900"
                                    alt="Hijab Fashion"
                                />
                            </div>

                            <div className="gallery-item">

                                <img
                                    src="https://images.pexels.com/photos/7691138/pexels-photo-7691138.jpeg?auto=compress&cs=tinysrgb&w=900"
                                    alt="Kashmiri Kurti"
                                />

                            </div>

                            <div className="gallery-item">

                                <img
                                    src="https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=900"
                                    alt="Premium Fashion"
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= Call To Action ================= */}

                <section className="story-cta">

                    <div className="container">

                        <div className="story-cta-box">

                            <span>
                                JOIN OUR JOURNEY
                            </span>

                            <h2>
                                Wear Confidence.
                                <br />
                                Wear SOUK.
                            </h2>

                            <p>
                                Every outfit tells a story. Discover timeless
                                collections crafted with elegance, quality,
                                and modern sophistication.
                            </p>

                            <div className="story-cta-buttons">

                                <Link
                                    to="/shop"
                                    className="story-btn"
                                >
                                    Shop Collection
                                </Link>

                                <Link
                                    to="/contact"
                                    className="story-btn-outline"
                                >
                                    Contact Us
                                </Link>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

            <Footer />

        </>
    );
}