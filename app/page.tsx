"use client";
import React from 'react'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Fundamentals from './components/fundamentals'
import CommunityStats from './components/communitystats'
import DojoSubscriptionCards from './components/subscription';
import Footer from './components/footer';
const page = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <Fundamentals/>
      <CommunityStats/> 
      <DojoSubscriptionCards/>
      <Footer/>
      
    </>
  )
}

export default page