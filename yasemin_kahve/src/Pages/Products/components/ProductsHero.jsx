import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../../useTranslation'

const ProductsHero = () => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="products-hero">
      <div className="hero-background-elements">
        <div className="floating-bean bean-1"></div>
        <div className="floating-bean bean-2"></div>
        <div className="floating-bean bean-3"></div>
        <div className="floating-bean bean-4"></div>
        <div className="floating-bean bean-5"></div>
        <div className="floating-bean bean-6"></div>
        <div className="floating-bean bean-7"></div>
      </div>
      
      <div className="hero-geometric">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
        <div className="geometric-shape shape-4"></div>
      </div>
      
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <div className="container">
        <div className={`hero-content ${isLoaded ? 'animate-in' : ''}`}>
          <div className="hero-badge">Premium Collection</div>
          <h1 className="hero-title">
            <span className="title-line-1">Our Premium</span>
            <span className="title-line-2">Coffee Collection</span>
          </h1>
          <p className="hero-subtitle">
            {t("createNewStory") || "Discover exceptional coffee beans carefully sourced from around the world. Each blend tells a story of tradition, craftsmanship, and passion for the perfect cup."}
          </p>
        </div>
      </div>
      
      <div className="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z" fill="#f8f6f3"></path>
        </svg>
      </div>
    </section>
  )
}

export default ProductsHero