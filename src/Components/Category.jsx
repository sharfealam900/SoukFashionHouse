import React from "react";

import Dupatta from "../assets/Dupatta.jpg";
import Kurti from "../assets/Kurti.jpg";
import Shawl from "../assets/Shawl.jpg";
import Stole from "../assets/Stole.jpg";


export default function Category() {

    const categories = [
        {
            id: 1,
            number: "01",
            name: "Kashmiri Shawls",
            image: Shawl,
        },
        {
            id: 2,
            number: "02",
            name: "Kurti",
            image: Kurti,
        },
        {
            id: 3,
            number: "03",
            name: "Embroidery Dupatta",
            image: Dupatta,
        },
        {
            id: 4,
            number: "04",
            name: "Embroidery Stole",
            image: Stole,
        },
    ];


    return (
        <section className="luxury-categories-section">

            <div className="container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="luxury-category-header">

                    <div className="luxury-category-heading">

                        <span>
                            THE COLLECTION
                        </span>

                        <h2>
                            Shop by Category
                        </h2>

                        <p>
                            Explore thoughtfully crafted collections
                            inspired by timeless Indian artistry,
                            refined fabrics, and contemporary elegance.
                        </p>

                    </div>


                    <div className="luxury-category-mark">

                        <span>EST.</span>

                        <strong>
                            SFH
                        </strong>

                        <span>
                            COLLECTION
                        </span>

                    </div>

                </div>


                {/* =================================================
                    CATEGORY GRID
                ================================================= */}

                <div className="luxury-category-grid">

                    {categories.map((item) => (

                        <div
                            className="luxury-category-card"
                            key={item.id}
                        >

                            {/* IMAGE */}

                            <div className="luxury-category-image">

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    loading="lazy"
                                />


                                {/* DARK GRADIENT */}

                                <div className="luxury-category-gradient" />


                                {/* NUMBER */}

                                <span className="luxury-category-number">
                                    {item.number}
                                </span>


                                {/* TOP LABEL */}

                                <span className="luxury-category-label">
                                    COLLECTION
                                </span>


                                {/* CONTENT */}

                                <div className="luxury-category-content">

                                    <span className="luxury-category-line" />

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <div className="luxury-category-explore">

                                        <span>
                                            Explore
                                        </span>

                                        <span className="luxury-category-arrow">
                                            →
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}