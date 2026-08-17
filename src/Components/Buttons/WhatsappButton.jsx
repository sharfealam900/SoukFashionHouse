import React from 'react'
import { FaWhatsapp } from "react-icons/fa";


export default function WhatsappButton() {
  return (
    <>
     <a
      href="https://wa.me/9871586648"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
    >
      <FaWhatsapp />
    </a>
    </>
  )
}
