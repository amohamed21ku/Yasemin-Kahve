import React, { useEffect, useState } from 'react'
import './AboutHero.css'
import { useTranslation } from "/src/useTranslation";

const AboutHero = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <section className="about-hero">
      <div className="hero-background-overlay"></div>
      
      <div className="floating-elements">
        <div className="float-element element-1"></div>
        <div className="float-element element-2"></div>
        <div className="float-element element-3"></div>
        <div className="float-element element-4"></div>
      </div>
      
      <div className={`about-hero-content ${isLoaded ? 'animate-in' : ''}`}>
        <div className="about-hero-text">
          <div className="hero-badge">Our Story</div>
          <h1>
            <span className="title-word word-1">{t('AboutTitle')}</span>
          </h1>
          <p className="about-subtitle">{t('AboutSubTitle')}</p>
          <div className="hero-accent-line"></div>
        </div>
        <div className="about-hero-image">
          <div className="image-frame">
            <img src="/static/images/assets/bean.png" alt="Coffee Beans" />
            <div className="image-glow"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero