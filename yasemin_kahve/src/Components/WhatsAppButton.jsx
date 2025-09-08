import React, { useState, useEffect } from 'react';

const WhatsAppButton = ({ currentPage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleWhatsAppClick = () => {
    const phoneNumber = '+905395004444';
    const message = encodeURIComponent('Hello! I would like to get information about your coffee products.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide button when scrolling
      setIsScrolling(true);
      
      // Check if we're in the contact section (assuming it's near the bottom)
      const contactSection = document.querySelector('[data-section="contact"]');
      const isInContactSection = contactSection && 
        currentScrollY + window.innerHeight >= contactSection.offsetTop;
      
      // Hide if in contact section
      if (isInContactSection) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Clear existing timeout
      clearTimeout(scrollTimeout);
      
      // Show button again after scrolling stops
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
      
      setLastScrollY(currentScrollY);
    };

    if (currentPage === 'home') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [currentPage, lastScrollY]);

  // Don't show button if not on homepage
  if (currentPage !== 'home') return null;
  
  // Don't show if not visible or scrolling
  if (!isVisible || isScrolling) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main WhatsApp Button */}
      <div
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* WhatsApp Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="white"
          style={{
            transform: isHovered ? 'rotate(5deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>

        {/* Pulse animation ring */}
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            border: '2px solid #25D366',
            borderRadius: '50%',
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(1.4)' : 'scale(1)',
            transition: 'all 0.8s ease-out',
            animation: !isHovered ? 'pulse 2s infinite' : 'none'
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          left: '75px',
          bottom: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        WhatsApp ile iletişime geçin
        {/* Tooltip arrow */}
        <div
          style={{
            position: 'absolute',
            left: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: '6px solid rgba(0, 0, 0, 0.8)'
          }}
        />
      </div>

      {/* CSS Keyframes for pulse animation - inline styles */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          70% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppButton;