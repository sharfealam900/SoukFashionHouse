import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import heroImg from "../assets/about/hero.jpg";
import shawlImg from "../assets/about/shawl.jpg";
import kurtiImg from "../assets/about/kurti.jpg";
import hijabImg from "../assets/about/hijab.jpg";
import storyImg from "../assets/about/story.jpg";
import coordsetImg from "../assets/about/coordset.jpg";

export default function Blog() {
    const blogs = [
        {
            id: 1,
            image: shawlImg,
            category: "Shawls",
            title: "5 Ways To Style Your Kashmiri Shawl",
            date: "02 August 2026",
            desc:
                "Discover timeless styling ideas for Kashmiri shawls that perfectly blend elegance and comfort.",
        },
        {
            id: 2,
            image: kurtiImg,
            category: "Kurtis",
            title: "Why Ari Work Kurtis Never Go Out Of Fashion",
            date: "28 July 2026",
            desc:
                "Explore the beauty of handcrafted Ari embroidery and why it remains a wardrobe essential.",
        },
        {
            id: 3,
            image: hijabImg,
            category: "Hijab",
            title: "Choosing The Perfect Hijab For Every Occasion",
            date: "22 July 2026",
            desc:
                "Find the right fabric, colors and styling tips for everyday wear and special events.",
        },
        {
            id: 4,
            image: coordsetImg,
            category: "Fashion",
            title: "Luxury Fabrics Every Woman Should Own",
            date: "18 July 2026",
            desc:
                "A guide to premium fabrics that provide elegance, comfort and durability.",
        },
        {
            id: 5,
            image: storyImg,
            category: "Winter",
            title: "Winter Wardrobe Essentials",
            date: "10 July 2026",
            desc:
                "Stay warm while looking stylish with our carefully selected winter essentials.",
        },
        {
            id: 6,
            image: heroImg,
            category: "Care Guide",
            title: "How To Care For Embroidered Clothing",
            date: "05 July 2026",
            desc:
                "Keep your premium embroidered outfits looking beautiful for years with proper care.",
        },
    ];

    return (
        <>
            <Navbar />

            <main className="blog-page">

                {/* HERO */}

                <section className="blog-hero">

                    <div className="container">

                        <span className="blog-tag">
                            SOUK JOURNAL
                        </span>

                        <h1>
                            Fashion Stories,
                            <br />
                            Style Inspiration &
                            Tradition
                        </h1>

                        <p>
                            Discover styling guides,
                            fashion trends,
                            craftsmanship stories
                            and everything that makes
                            timeless fashion beautiful.
                        </p>

                    </div>

                </section>

                {/* FEATURED */}

                <section className="featured-blog">

                    <div className="container">

                        <div className="row align-items-center g-5">

                            <div className="col-lg-6">

                                <img
                                    src={storyImg}
                                    alt=""
                                    className="img-fluid rounded-4"
                                />

                            </div>

                            <div className="col-lg-6">

                                <span className="featured-label">
                                    FEATURED ARTICLE
                                </span>

                                <h2>
                                    The Art Of Kashmiri
                                    Craftsmanship
                                </h2>

                                <p>

                                    Every stitch tells a story.

                                    Kashmiri artisans have
                                    preserved centuries-old
                                    embroidery techniques that
                                    continue to inspire luxury
                                    fashion around the world.

                                </p>

                                <Link
                                    to="#"
                                    className="blog-btn"
                                >
                                    Read Article

                                    <ArrowRight size={18} />

                                </Link>

                            </div>

                        </div>

                    </div>

                </section>

                {/* LATEST BLOGS */}

                <section className="latest-blogs">

                    <div className="container">

                        <div className="section-title">

                            <span>
                                LATEST ARTICLES
                            </span>

                            <h2>
                                Fashion Journal
                            </h2>

                        </div>

                        <div className="row g-4">
                            {blogs.map((blog) => (

                                <div
                                    className="col-lg-4 col-md-6"
                                    key={blog.id}
                                >

                                    <article className="blog-card">

                                        <div className="blog-image">

                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="img-fluid"
                                            />

                                            <span className="blog-category">

                                                {blog.category}

                                            </span>

                                        </div>

                                        <div className="blog-content">

                                            <small className="blog-date">

                                                {blog.date}

                                            </small>

                                            <h3>

                                                {blog.title}

                                            </h3>

                                            <p>

                                                {blog.desc}

                                            </p>

                                           

                                        </div>

                                    </article>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                {/* =========================
            FASHION TIPS
        ========================= */}

                <section className="fashion-tips">

                    <div className="container">

                        <div className="section-title">

                            <span>
                                STYLE GUIDE
                            </span>

                            <h2>
                                Fashion Tips From Our Experts
                            </h2>

                        </div>

                        <div className="row g-4">

                            <div className="col-lg-3 col-md-6">

                                <div className="tip-card">

                                    <h4>
                                        Perfect Shawl Styling
                                    </h4>

                                    <p>

                                        Learn elegant draping styles
                                        for everyday wear,
                                        weddings and festive occasions.

                                    </p>

                                </div>

                            </div>

                            <div className="col-lg-3 col-md-6">

                                <div className="tip-card">

                                    <h4>
                                        Hijab Care
                                    </h4>

                                    <p>

                                        Keep your hijabs fresh,
                                        soft and long-lasting
                                        with proper washing
                                        and storage tips.

                                    </p>

                                </div>

                            </div>

                            <div className="col-lg-3 col-md-6">

                                <div className="tip-card">

                                    <h4>
                                        Ari Work Guide
                                    </h4>

                                    <p>

                                        Discover how handcrafted
                                        Ari embroidery creates
                                        timeless luxury pieces.

                                    </p>

                                </div>

                            </div>

                            <div className="col-lg-3 col-md-6">

                                <div className="tip-card">

                                    <h4>
                                        Winter Collection
                                    </h4>

                                    <p>

                                        Build a stylish winter
                                        wardrobe using premium
                                        shawls and embroidered
                                        kurtis.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>
                {/* =========================
            NEWSLETTER
        ========================= */}

                <section className="blog-newsletter">

                    <div className="container">

                        <div className="newsletter-box">

                            <span>
                                JOIN OUR COMMUNITY
                            </span>

                            <h2>
                                Stay Inspired With
                                SOUK Fashion
                            </h2>

                            <p>

                                Subscribe to receive style tips,
                                new arrivals, exclusive offers
                                and fashion inspiration directly
                                in your inbox.

                            </p>

                            <form className="newsletter-form">

                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                />

                                <button
                                    type="submit"
                                >
                                    Subscribe
                                </button>

                            </form>

                        </div>

                    </div>

                </section>

                {/* =========================
            INSTAGRAM GALLERY
        ========================= */}

                <section className="instagram-section">

                    <div className="container">

                        <div className="section-title">

                            <span>
                                FOLLOW US
                            </span>

                            <h2>
                                @soukfashionhouse
                            </h2>

                        </div>

                        <div className="row g-3">

                            {[shawlImg, kurtiImg, hijabImg, coordsetImg, storyImg, heroImg].map((img, index) => (

                                <div
                                    className="col-lg-2 col-md-4 col-6"
                                    key={index}
                                >

                                    <div className="instagram-card">

                                        <img
                                            src={img}
                                            alt="Instagram"
                                            className="img-fluid"
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>

                {/* =========================
            CTA
        ========================= */}

                <section className="blog-cta">

                    <div className="container">

                        <div className="cta-box">

                            <span>
                                SOUK FASHION HOUSE
                            </span>

                            <h2>

                                Discover Timeless
                                Kashmiri Elegance

                            </h2>

                            <p>

                                Explore handcrafted kurtis,
                                elegant shawls, premium hijabs
                                and modest fashion designed
                                for every woman.

                            </p>

                            <Link
                                to="/shop"
                                className="blog-btn"
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