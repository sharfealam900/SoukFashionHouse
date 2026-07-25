import React from 'react'

export default function Testimonial() {
    const testimonials = [
        {
            id: 1,
            name: "Huzaifa A.",
            city: "New Delhi",
            review:
                "Ordered a pashmina for my mother and the fabric quality was beyond what I expected. Beautiful packaging and premium quality.",
        },
        {
            id: 2,
            name: "Junaid A.",
            city: "Rampur",
            review:
                "The embroidery work was absolutely stunning. Everyone asked me where I bought it. Highly recommended.",
        },
        {
            id: 3,
            name: "Sara K.",
            city: "Lucknow",
            review:
                "Amazing customer support and fast delivery. The outfit looked exactly like the pictures. Will definitely order again.",
        },
    ];

    return (
        <>
            <section className="testimonials-section">

                <div className="container">

                    <div className="section-title">

                        <span>Customer Reviews</span>

                        <h2>What Our Customers Say</h2>

                    </div>

                    <div className="row g-4">

                        {testimonials.map((item) => (

                            <div className="col-lg-4" key={item.id}>

                                <div className="testimonial-card">

                                    <div className="stars">
                                        ★★★★★
                                    </div>

                                    <p>{item.review}</p>

                                    <h4>{item.name}</h4>

                                    <span>{item.city}</span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

        </>
    )
}
