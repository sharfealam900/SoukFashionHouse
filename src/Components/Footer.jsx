import React from 'react'
import { FaFacebookF, FaInstagram, FaPinterestP, FaWhatsapp, } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <>
            <footer className="footer">

                <div className="container">

                    <div className="row gy-5">

                        {/* Brand */}

                        <div className="col-lg-4">

                            <h2 className="footer-logo">
                                Souk
                            </h2>

                            <span className='text-color: rgba(255, 255, 255, .55);'>
                                The House of Fashion. Trendy, elegant, timeless pieces — handpicked and shipped across India, one DM at a time.
                            </span>

                            <div className="social-icons">

                                <a href="#">
                                    <FaFacebookF />
                                </a>

                                <a href="#">
                                    <FaInstagram />
                                </a>

                                <a href="#">
                                    <FaPinterestP />
                                </a>

                                <a href="#">
                                    <FaWhatsapp />
                                </a>

                            </div>

                        </div>

                        {/* Shop */}

                        <div className="col-lg-2 col-md-4">

                            <h5>Shop</h5>

                            <ul>

                                <li><a href="#">Shawls</a></li>

                                <li><a href="#">Sarees</a></li>

                                <li><a href="#">Suits</a></li>

                                <li><a href="#">New Arrival</a></li>

                            </ul>

                        </div>

                        {/* Company */}

                        <div className="col-lg-2 col-md-4">

                            <h5>Company</h5>

                            <ul>

                                <li>
                                    <Link to="/about">About</Link>
                                </li>

                                <li>
                                    <Link to="/contact">Contact</Link>
                                </li>

                                <li>
                                    <Link to="/blog">Blog</Link>
                                </li>

                                <li>
                                    <Link to="/privacy-policy">Privacy Policy</Link>
                                </li>

                            </ul>

                        </div>

                        {/* Contact */}

                        <div className="col-lg-4 col-md-4 ">

                            <h5>Contact</h5>

                            <p>
                                📍 New Delhi, India
                            </p>

                            <p>
                                📞 +91 98765 43210
                            </p>

                            <p>
                                ✉ support@soukfashion.com
                            </p>

                            <p>
                                Mon – Sat : 10:00 AM – 7:00 PM
                            </p>

                        </div>

                    </div>

                    <hr />

                    <div className="copyright">

                        © {new Date().getFullYear()} Souk Fashion House.
                        All Rights Reserved.

                    </div>

                </div>

            </footer>
        </>
    )
}
