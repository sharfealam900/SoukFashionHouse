import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Send,
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Contact() {
  const [activeFAQ, setActiveFAQ] = useState(null);

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

            <form className="contact-form">

              <h2>Send Message</h2>

              <div className="input-group">

                <input
                  type="text"
                  placeholder="Full Name"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  required
                />

              </div>

              <div className="input-group">

                <input
                  type="text"
                  placeholder="Phone Number"
                />

                <input
                  type="text"
                  placeholder="Subject"
                />

              </div>

              <textarea
                rows="7"
                placeholder="Write your message..."
              />

              <button
                type="submit"
                className="contact-btn"
              >
                Send Message
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
                  className={`faq-item ${
                    activeFAQ === index ? "active" : ""
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