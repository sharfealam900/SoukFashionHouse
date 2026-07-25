import React from 'react'

export default function Instagram() {
    const gallery = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
    text: "Elegant Collection",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
    text: "Luxury Style",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    text: "Festive Wear",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    text: "Premium Fabric",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
    text: "New Arrival",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    text: "Timeless Fashion",
  },
];

  return (
    <>
    <section className="instagram-section">

      <div className="container">

        <div className="instagram-title">

          <span>FOLLOW US</span>

          <h2>@SoukFashionHouse</h2>

        </div>

        <div className="row g-3">

          {gallery.map((item) => (

            <div className="col-lg-2 col-md-4 col-6" key={item.id}>

              <div className="instagram-card">

                <img src={item.image} alt={item.text} />

                <div className="instagram-overlay">

                  <h5>{item.text}</h5>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  
    </>
  )
}
