import React from 'react'

export default function Newsletter() {
    return (
        <>
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

                        <form className="newsletter-form">

                            <input
                                type="email"
                                placeholder="Enter your email"
                            />

                            <button>
                                Subscribe
                            </button>

                        </form>

                    </div>

                </div>

            </section>
        </>
    )
}
