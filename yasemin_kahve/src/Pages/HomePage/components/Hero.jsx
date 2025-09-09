// Hero.jsx with translations
import React, { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "/src/useTranslation";

const Hero = ({ onNavigate }) => {  // Add onNavigate as a prop
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setIsLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Preload video
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true);
      });
    }
  }, []);

  const slides = [
    {
      title: "Yasemin Kahve",
      description: t("yaseminHeroDescription"),
      cta: t("exploreProducts") ,
    },
    
  ];

  const slide = slides[currentSlide];

  // Generate animated dots (coffee beans)
  useEffect(() => {
    const animatedElements = document.querySelector('.animated-elements');
    if (animatedElements && animatedElements.children.length === 0) {
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.className = `animated-dot ${Math.random() > 0.5 ? 'type-1' : 'type-2'}`;
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 5}s`;
        dot.style.animationDuration = `${3 + Math.random() * 2}s`;
        animatedElements.appendChild(dot);
      }
    }
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.querySelector('.products-preview');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePriceListClick = () => {
    const phoneNumber = "+90 539 500 44 44";
    const message = t("whatsAppPriceListMessage");
    const whatsAppUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsAppUrl, '_blank');
  };

  const handleAcademyClick = () => {
    if (onNavigate) {
      onNavigate('academy');
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        {/* Video background */}
        <div className={`video-background ${isVideoLoaded ? 'loaded' : ''}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="data:image/gif,AAAA" // Tiny transparent GIF as placeholder
          >
            <source src="/public/static/images/assets/broll.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="animated-elements"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <img src="/static/images/assets/yaso2.png" alt="Yasemin Kahve" className="hero-logo-image" />
            <span className="title-highlight">{slide.subtitle}</span>
          </h1>

          <p className="hero-description">{slide.description}</p>

          <div className="hero-buttons">
            <div className="hero-buttons-row">
              <button 
                className="btn-primary"
                onClick={scrollToProducts}
              >
                <span>{slide.cta}</span>
              </button>
              <button 
                className="btn-secondary academy-btn animated-button"
                onClick={handleAcademyClick}
              >
                <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
                <span className="text">{t("discoverAcademy") || "Akademiyi Keşfet"}</span>
                <span className="circle"></span>
                <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
              </button>
            </div>
            <button 
              className="btn-secondary price-list-btn"
              onClick={handlePriceListClick}
            >
              <p>{t("PriceList") || "Price List"}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="price-icon" viewBox="0 0 24 24">
                <path d="M9 11H7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3zm0 0V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2zm7 0V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2zM7 3h10v2H7V3zM5 21v-2h14v2H5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <ChevronDown />
      </div>

    </section>
  );
};

export default Hero;