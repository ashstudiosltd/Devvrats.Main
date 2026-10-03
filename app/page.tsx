"use client";
import React from 'react'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Fundamentals from './components/fundamentals'
import Footer from './components/footer';
import AboutDevvrats from './components/aboutdevvrats';
import ScrollImageSection from './components/Scrollimagesection';
import BottomProgressiveBlur from '@/components/BottomProgressiveBlur';
import SabhaSection from './components/Sabhasection';
import DID from './components/didsection';
const page = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <AboutDevvrats/>
      <ScrollImageSection/>
      <Fundamentals/>
      <DID/>
      <SabhaSection/>
      <BottomProgressiveBlur/>
      <Footer/>
      
      
    </>
  )
}

export default page