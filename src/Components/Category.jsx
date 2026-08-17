import React from "react";
import Dupatta from "../assets/Dupatta.jpg";
import Kurti from "../assets/Kurti.jpg";
import Shawl from "../assets/Shawl.jpg";
import Stole from "../assets/Stole.jpg";


export default function Category() {
const categories = [
    {
      id: 1,
      name: "Kashmiri Shawls",
      image: Shawl,
    },
    {
      id: 2,
      name: "Kurti",
      image: Kurti,
    },
    {
      id: 3,
      name: "Embroidery Dupatta",
      image: Dupatta,
    },
    {
      id: 4,
      name: "Embroidery Stole",
      image: Stole,
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