
import React from 'react'
import Hero from '../components/Landingpage/HeroSection'
import Navbar from '@/components/layout/Navbar'
import FooterSection from '../components/Landingpage/footer'
function page() {
  return (
    <>
    <main>
      <Navbar/>
    <Hero/>
    <FooterSection/>
    </main>
    </>
  )
}

export default page