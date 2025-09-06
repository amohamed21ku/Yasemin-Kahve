import React from 'react'
import './AboutHero.css'
import { useTranslation } from "/src/useTranslation";




const AboutHero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="about-hero">
      <div className="about-hero-content">
        <div className="about-hero-text">
          <h1>{t('AboutTitle')}</h1>
          <p className="about-subtitle">{t('AboutSubTitle')}</p>
        </div>
        <div className="about-hero-image">
          <img src="/static/images/assets/bean.png" alt="Coffee Beans" />
        </div>
      </div>
    </section>
  )
}

export default AboutHero