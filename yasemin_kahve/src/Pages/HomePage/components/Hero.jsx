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
      subtitle: t("since1921"),
      description: t("yaseminHeroDescription"),
      cta: t("exploreProducts") ,
    }
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
            <button 
              className="btn-primary"
              onClick={scrollToProducts}
            >
              <span>{slide.cta}</span>
            </button>
            <button 
              className="btn-secondary"
              onClick={handlePriceListClick}
            >
              <span>{t("PriceList") || "Price List"}</span>
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