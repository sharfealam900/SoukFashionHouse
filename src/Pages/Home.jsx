import React from "react";

import SEO from "../Components/SEO";

import Navbar from "../Components/Navbar";
import Story from "../Components/Story";
import Instagram from "../Components/Instagrams/Instagram";
import Testimonial from "../Components/Testimonial";
import Newsletter from "../Components/Newsletter";
import Footer from "../Components/Footer";

import WhatsappButton from "../Components/Buttons/WhatsappButton";
import BackToTop from "../Components/Buttons/BackToTop";

import Category from "../Components/Category";
import TopTicker from "../Components/TopTicker";

import BestSeller from "../Components/Product/BestSeller";
import NewArrival from "../Components/Product/NewArrival";

import BannerSlider from "../admin/components/BannerSlider";
import OrganizationSchema from "../Components/SEO/OrganizationSchema";
import WebsiteSchema from "../Components/SEO/WebsiteSchema";

export default function Home() {
  return (
    <>
      <SEO
        title="Souk Fashion House | Elegant Fashion & Modern Modesty"
        description="Discover elegant women's fashion, modern modest wear, premium fabrics, handcrafted embroidery and timeless collections at Souk Fashion House."
        keywords="Souk Fashion House, women's fashion, modest fashion, ethnic wear, kurtis, shawls, dupattas, Kashmiri fashion, embroidered clothing, Indian fashion"
        url="/"

      />

      <OrganizationSchema />
    <WebsiteSchema />

      <Navbar />

      <BannerSlider />

      <TopTicker />

      <Category />

      <BestSeller />
      <NewArrival />

      <Story />

      <Instagram />

      <Testimonial />

      <Newsletter />

      <Footer />

      <WhatsappButton />
      <BackToTop />
    </>
  );
}