import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Send,
} from "lucide-react";

import { toast } from "react-hot-toast";


import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../api/axios";

export default function Contact() {

  const [activeFAQ, setActiveFAQ] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };





  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "Orders are usually delivered within 3–7 business days depending on your location.",
    },
    {
      question: "Can I return my order?",
      answer:
        "Yes. You can request a return within 7 days after receiving your order.",
    },
    {
      question: "How can I track my order?",
      answer:
        "After dispatch, you'll receive an email and SMS with your tracking link.",
    },
    {
      question: "Do you offer Cash on Delivery?",
      answer:
        "Yes, Cash on Delivery is available in most serviceable locations.",
    },
  ];





  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });

      toast.success("Message sent successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };




  return (
    <>
      <Navbar />

      <main className="contact-page">

        {/* Hero */}

        <section className="contact-hero">

          <div className="container">

            <span>CONTACT US</span>

            <h1>
              We'd Love To
              <br />
              Hear From You
            </h1>

            <p>
              Whether you have a question about orders,
              products, returns, or partnerships,
              our team is always here to help.
            </p>

          </div>

        </section>

        {/* Contact Section */}

        <section className="contact-section">

          <div className="container contact-grid">

            {/* Left */}

            <div>

              <div className="contact-card">

                <Phone size={28} />

                <div>
                  <h3>Call Us</h3>
                  <p>+91 98765 43210</p>
                </div>

              </div>

              <div className="contact-card">

                <Mail size={28} />

                <div>
                  <h3>Email</h3>
                  <p>support@soukfashion.com</p>
                </div>

              </div>

              <div className="contact-card">

                <MapPin size={28} />

                <div>
                  <h3>Address</h3>
                  <p>
                    New Delhi,
                    India
                  </p>
                </div>

              </div>

              <div className="contact-card">

                <Clock size={28} />

                <div>
                  <h3>Working Hours</h3>
                  <p>
                    Monday - Saturday
                    <br />
                    9:00 AM – 7:00 PM
                  </p>
                </div>

              </div>

            </div>

            {/* Form */}

            <form
              className="contact-form"
              onSubmit={submitHandler}
            >

              <h2>Send Message</h2>

              <div className="input-group">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />

              </div>
              <textarea
                rows="7"
                name="message"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="contact-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
                <Send size={18} />
              </button>

            </form>

          </div>

        </section>

        {/* Map */}

        <section className="contact-map">

          <iframe
            title="map"
            src="https://www.google.com/maps?q=New+Delhi&output=embed"
            loading="lazy"
          />

        </section>

        {/* FAQ */}

        <section className="contact-faq">

          <div className="container">

            <div className="section-heading">

              <span>FAQ</span>

              <h2>Frequently Asked Questions</h2>

            </div>

            <div className="faq-wrapper">

              {faqs.map((faq, index) => (

                <div
                  key={index}
                  className={`faq-item ${activeFAQ === index ? "active" : ""
                    }`}
                >

                  <button
                    onClick={() =>
                      setActiveFAQ(
                        activeFAQ === index
                          ? null
                          : index
                      )
                    }
                  >
                    {faq.question}

                    <ChevronDown size={18} />

                  </button>

                  {activeFAQ === index && (

                    <p>{faq.answer}</p>

                  )}

                </div>

              ))}

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}