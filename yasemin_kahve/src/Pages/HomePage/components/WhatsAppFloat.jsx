import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '/src/useTranslation';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let scrollTimer;
    
    const handleScroll = () => {
      if (isDismissed) return;
      
      setIsScrolling(true);
      setIsVisible(false);
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Show tooltip after 3 seconds
    const tooltipTimer = setTimeout(() => {
      if (!isDismissed) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      clearTimeout(tooltipTimer);
    };
  }, [isDismissed]);

  const handleWhatsAppClick = () => {
    const phoneNumber = "+90 539 500 44 44";
    const message = t("whatsAppGeneralMessage") || "Merhaba, size nasıl yardımcı olabilirim?";
    const whatsAppUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsAppUrl, '_blank');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <div className={`whatsapp-float ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="whatsapp-container">
        <button 
          className="whatsapp-dismiss"
          onClick={handleDismiss}
          title="Kapat"
        >
          <X size={12} />
        </button>
        
        <button 
          className="whatsapp-button"
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="whatsapp-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M12.012 2C6.486 2 2.013 6.473 2.013 12c0 1.75.453 3.395 1.242 4.834L2 22l5.242-1.236A9.951 9.951 0 0 0 12.012 22c5.526 0 9.999-4.473 9.999-10S17.538 2 12.012 2zm5.313 14.25c-.225.632-.887 1.163-1.518 1.313-.434.103-.997.156-2.896-.619-2.049-1.236-4.026-3.649-4.148-3.814-.121-.163-.996-1.325-.996-2.528 0-1.203.632-1.796.857-2.044.225-.247.491-.309.656-.309.163 0 .328.002.47.009.151.007.354-.057.553.422.225.55.764 1.865.829 2 .066.134.11.291.022.469-.088.178-.132.289-.266.445-.134.156-.282.348-.402.469-.134.134-.273.278-.117.545.156.267.694 1.146 1.492 1.855 1.028.912 1.895 1.194 2.162 1.329.267.134.422.111.578-.067.156-.178.667-.778.845-1.045.178-.267.356-.223.6-.134.245.089 1.556.734 1.823.867.267.134.445.2.511.311.067.111.067.645-.158 1.278z"/>
            </svg>
          </div>
          <div className="whatsapp-pulse"></div>
        </button>

        {showTooltip && (
          <div className="whatsapp-tooltip">
            <span>{t("whatsAppTooltip") || "Bize WhatsApp'tan yazın!"}</span>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppFloat;