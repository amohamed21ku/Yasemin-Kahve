import React from 'react'
import './AboutHero.css'

const AboutHero = () => {
  return (
    <section className="about-hero">
      <div className="about-hero-content">
        <div className="about-hero-text">
          <h1>ROASTED TO PERFECTION…</h1>
          <p className="about-subtitle">Since 1921 - A Century of Coffee Excellence</p>
        </div>
        <div className="about-hero-image">
          <img src="/static/images/assets/bean.png" alt="Coffee Beans" />
        </div>
      </div>
    </section>
  )
}

export default AboutHero