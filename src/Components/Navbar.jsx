import React from 'react'
import {FaHeart,FaShoppingBag, FaSearch,FaBars} from "react-icons/fa";


export default function Navbar() {
  return (
    <>
    <div className="topbar">
                ✦ Complimentary Shipping Across India On Orders Above
                <strong> ₹2,999 </strong>
                ✦
            </div>

            <header className="header">

                <nav className="navbar navbar-expand-lg">

                    <div className="container">

                        {/* Logo */}

                        <a className="navbar-brand logo" href="/">

                            <div className="logo-circle">
                                S
                            </div>

                            <div>

                                <h3>Souk</h3>

                                <span>The House of Fashion</span>

                            </div>

                        </a>

                        <button
                            className="navbar-toggler"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbar"
                        >
                            <FaBars />
                        </button>

                        <div
                            className="collapse navbar-collapse"
                            id="navbar"
                        >

                            <ul className="navbar-nav mx-auto">

                                <li className="nav-item">
                                    <a href="/">Shawls</a>
                                </li>

                                <li className="nav-item">
                                    <a href="/">Suits</a>
                                </li>

                                <li className="nav-item">
                                    <a href="/">Sarees</a>
                                </li>

                                <li className="nav-item">
                                    <a href="/">Bestsellers</a>
                                </li>

                                <li className="nav-item">
                                    <a href="/">Our Story</a>
                                </li>

                                <li className="nav-item">
                                    <a href="/">Contact</a>
                                </li>

                            </ul>

                            <div className="nav-icons">

                                <FaSearch />

                                <FaHeart />

                                <FaShoppingBag />

                            </div>

                        </div>

                    </div>

                </nav>

            </header>
    </>
  )
}
