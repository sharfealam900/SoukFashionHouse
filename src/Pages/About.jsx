import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Sparkles,
  Users,
  Package,
  Globe,
  ArrowRight,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function About() {
  const values = [
    {
      icon: <Sparkles size={32} />,
      title: "Premium Quality",
      text: "Every piece is carefully selected to deliver exceptional quality, timeless style, and lasting comfort.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Trusted Shopping",
      text: "Secure payments, transparent pricing, and customer-first service at every step of your journey.",
    },
    {
      icon: <Truck size={32} />,
      title: "Fast Delivery",
      text: "Quick and reliable shipping with hassle-free returns for a seamless shopping experience.",
    },
    {
      icon: <BadgeCheck size={32} />,
      title: "Authentic Products",
      text: "We partner with trusted brands to ensure every product is genuine and crafted to perfection.",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Happy Customers",
      icon: <Users size={28} />,
    },
    {
      number: "500+",
      label: "Fashion Products",
      icon: <Package size={28} />,
    },
    {
      number: "25+",
      label: "Premium Brands",
      icon: <BadgeCheck size={28} />,
    },
    {
      number: "20+",
      label: "Cities Served",
      icon: <Globe size={28} />,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* Hero */}

        <section className="about-hero">

          <div className="about-overlay"></div>

          <div className="container about-hero-content">

            <span>ABOUT SOUK</span>

            <h1>
              Crafting Modern Fashion
              <br />
              With Timeless Elegance
            </h1>

            <p>
              SOUK is more than a fashion destination.
              We curate premium clothing that blends
              quality craftsmanship, contemporary design,
              and everyday confidence.
            </p>

            <Link to="/shop" className="about-btn">
              Explore Collection
              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

        {/* Story */}

        <section className="about-story">

          <div className="container story-grid">

            <div className="story-image">

              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900"
                alt="Fashion"
              />

            </div>

            <div className="story-content">

              <span>OUR STORY</span>

              <h2>
                Fashion Inspired By
                Simplicity & Confidence
              </h2>

              <p>
                We believe fashion should empower people,
                not overwhelm them. Our collections are
                carefully curated with a focus on timeless
                essentials, premium fabrics, and elegant
                silhouettes that elevate everyday life.
              </p>

              <p>
                From casual wear to statement pieces,
                every product reflects our commitment to
                quality, authenticity, and modern luxury.
              </p>

            </div>

          </div>

        </section>

        {/* Values */}

        <section className="about-values">

          <div className="container">

            <div className="section-heading">

              <span>WHY CHOOSE US</span>

              <h2>Luxury Meets Everyday Fashion</h2>

            </div>

            <div className="value-grid">

              {values.map((item, index) => (

                <div
                  className="value-card"
                  key={index}
                >

                  <div className="value-icon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.text}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* Statistics */}

        <section className="about-stats">

          <div className="container">

            <div className="stats-grid">

              {stats.map((item, index) => (

                <div
                  className="stat-card"
                  key={index}
                >

                  <div className="stat-icon">
                    {item.icon}
                  </div>

                  <h2>{item.number}</h2>

                  <p>{item.label}</p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="about-cta">

          <div className="container">

            <div className="cta-box">

              <h2>
                Discover Your Signature Style
              </h2>

              <p>
                Explore our latest arrivals and premium
                collections designed for every occasion.
              </p>

              <Link
                to="/shop"
                className="about-btn"
              >
                Shop Now
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