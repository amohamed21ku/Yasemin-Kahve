import React from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import './AboutUs.css'

const AboutUs = ({ onNavigate }) => {
  return (
    <div className="about-us-page">
      <Header onNavigate={onNavigate} />
      <div className="about-content">
        <h1>About Yasemin Kahve</h1>
        <p>Content coming soon...</p>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs