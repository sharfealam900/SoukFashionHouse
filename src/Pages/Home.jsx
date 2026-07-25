import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'

import Products from '../Components/Product/Products'
import Story from '../Components/Story'
import Instagram from '../Components/Instagrams/Instagram'
import Testimonial from '../Components/Testimonial'
import Newsletter from '../Components/Newsletter'
import Footer from '../Components/Footer'
import WhatsappButton from '../Components/Buttons/WhatsappButton'
import BackToTop from '../Components/Buttons/BackToTop'
import Category from '../Components/Category'
import TopTicker from '../Components/TopTicker'

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    <TopTicker/>
    <Category/>
    <Products/>
    <Story/>
    <Instagram/>
    <Testimonial/>
    <Newsletter/>
    <Footer/>
    <WhatsappButton/>
    <BackToTop/>
  
    </>
  )
}
