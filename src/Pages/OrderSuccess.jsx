import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SEO from "../Components/SEO";

export default function OrderSuccess() {
  return (
    <>
      <SEO
        title="OrderSuccess | Souk Fashion House"
        noIndex
      />
      <Navbar />

      <section className="container py-5 text-center">

        <h1>🎉 Order Placed Successfully</h1>

        <p className="mt-3">
          Thank you for shopping with Souk Fashion House.
        </p>

        <Link
          to="/"
          className="btn btn-dark mt-4"
        >
          Continue Shopping
        </Link>

      </section>

      <Footer />
    </>
  );
}