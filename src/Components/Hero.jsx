import React from 'react'

export default function Hero() {
  return (
    <>
    <section className="hero-section">
      <div className="container">

        <div className="row align-items-center">

          {/* Left */}

          <div className="col-lg-6 hero-content">

            <span className="hero-tag">
              NEW SEASON • TRENDY • ELEGANT • TIMELESS
            </span>

            <h1>
              Elevate your style
              <br />
              with <span>Souk</span>
            </h1>

            <p>
              Hand-finished suits, premium pashmina shawls and festive
              collections designed with timeless elegance.
            </p>

            <div className="hero-buttons">

              <button className="btn-shop">
                Shop Collection
              </button>

              <button className="btn-outline">
                Order on WhatsApp
              </button>

            </div>

          </div>

          {/* Right */}

          <div className="col-lg-6">

            <div className="hero-images">

              <div className="image-big">

                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700"
                  alt=""
                />

              </div>

              <div className="image-small">

                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500"
                  alt=""
                />

              </div>

              <div className="hero-card">

                <h3>180+</h3>

                <p>Looks & Counting</p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
    </>
  )
}
