import React, { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa';

export default function BackToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setShow(window.scrollY > 400);

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (
        <>
            <button
                className={`top-btn ${show ? "show" : ""}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>

                <FaArrowUp />

            </button>

        </>
    )
}
