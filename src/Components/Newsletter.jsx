import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";


export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribeHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email.");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/subscribers", {
        email,
      });

      toast.success(
        data.message || "Subscribed successfully."
      );

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Subscription failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <span className="newsletter-tag">
            Stay in the Loop
          </span>

          <h2>
            Get First Access
            <br />
            to New Arrivals
          </h2>

          <p>
            Join our newsletter for exclusive launches,
            festive collections, special discounts,
            and styling inspiration.
          </p>

          <form
            className="newsletter-form"
            onSubmit={subscribeHandler}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Subscribing..."
                : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}