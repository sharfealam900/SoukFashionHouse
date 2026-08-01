import React from "react";

export default function Category() {
  const categories = [
    {
      id: 1,
      name: "Shawls",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600",
    },
    {
      id: 2,
      name: "Kurti",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    },
    {
      id: 3,
      name: "Sarees",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
    },
    {
      id: 4,
      name: "Festive Sets",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    },
  ];

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-title">
          <h2>Shop by Category</h2>

          <p>
            Discover timeless collections crafted with premium fabrics,
            elegant embroidery, and luxurious finishes.
          </p>
        </div>

        <div className="row g-4">
          {categories.map((item) => (
            <div className="col-lg-3 col-md-6" key={item.id}>
              <div className="category-card">
                <img src={item.image} alt={item.name} />

                <div className="overlay">
                  <h3>{item.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}