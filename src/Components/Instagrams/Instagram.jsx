import React from "react";

import insta1 from "../../assets/insta1.jpg";
import insta2 from "../../assets/insta2.jpg";
import insta3 from "../../assets/insta3.jpg";
import insta4 from "../../assets/insta4.jpg";
import insta5 from "../../assets/insta5.jpg";
import insta6 from "../../assets/insta6.jpg";

export default function Instagram() {
    const gallery = [
        {
            id: 1,
            image: insta1,
            text: "Elegant Collection",
        },
        {
            id: 2,
            image: insta2,
            text: "Luxury Style",
        },
        {
            id: 3,
            image: insta3,
            text: "Festive Wear",
        },
        {
            id: 4,
            image: insta4,
            text: "Premium Fabric",
        },
        {
            id: 5,
            image: insta5,
            text: "New Collection",
        },
        {
            id: 6,
            image: insta6,
            text: "Souk Fashion House",
        },
    ];

    return (
        <section className="instagram-section">
            <div className="container">

                <div className="instagram-title">
                    <span>FOLLOW US</span>

                    <h2>@SoukFashionHouse</h2>
                </div>

                <div className="row g-3">
                    {gallery.map((item) => (
                        <div
                            className="col-lg-2 col-md-4 col-6"
                            key={item.id}
                        >
                            <div className="instagram-card">

                                <img
                                    src={item.image}
                                    alt={item.text}
                                />

                                <div className="instagram-overlay">
                                    <h5>{item.text}</h5>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}