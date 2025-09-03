import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const AboutHero = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const slides = [
    {
      title: "Master the Art of Coffee",
      subtitle: "Passion • Craft • Excellence",
      description: "Transform your love for coffee into professional expertise with our comprehensive courses taught by industry masters.",
      cta: "Browse Courses",
    },
    {
      title: "From Bean to Cup",
      subtitle: "Learn • Practice • Perfect",
      description: "Discover the complete coffee journey from sourcing and roasting to brewing the perfect cup and creating stunning latte art.",
      cta: "Start Learning",
    },
    {
      title: "Build Your Coffee Career",
      subtitle: "Certified • Professional • Successful",
      description: "Join our SCA-certified programs and launch your career in the thriving specialty coffee industry.",
      cta: "Get Certified",
    },
  ];

  const slide = slides[currentSlide];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  return (
    <>
      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: #1a1a1a;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .hero-video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
          z-index: 1;
          opacity: ${videoLoaded ? '1' : '0'};
          transition: opacity 1s ease-in-out;
        }

        .video-fallback {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%);
          opacity: ${videoLoaded ? '0' : '1'};
          transition: opacity 1s ease-in-out;
          z-index: 1;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(139, 69, 19, 0.8) 0%,
            rgba(160, 82, 45, 0.7) 50%,
            rgba(101, 67, 33, 0.8) 100%
          );
          z-index: 2;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          z-index: 3;
        }

        .animated-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          pointer-events: none;
        }

        .animated-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: float 4s ease-in-out infinite;
        }

        .animated-dot.type-1 {
          background: rgba(210, 180, 140, 0.4);
          animation-direction: alternate;
        }

        .animated-dot.type-2 {
          background: rgba(255, 228, 196, 0.3);
          animation-direction: alternate-reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
        }

        .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
          max-width: 1200px;
          padding: 0 20px;
          color: white;
        }

        .hero-text {
          opacity: ${isLoaded ? '1' : '0'};
          transform: translateY(${isLoaded ? '0' : '30px'});
          transition: all 1s ease-out;
          transition-delay: 0.3s;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }

        .title-part {
          display: block;
          color: #f8f8f8;
          margin-bottom: 0.5rem;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(135deg, #D4AF37, #FFD700, #F4A460);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-weight: 300;
          color: #D4AF37;
          margin-bottom: 2rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.9;
        }

        .hero-description {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #D4AF37, #B8860B);
          color: white;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
          background: linear-gradient(135deg, #FFD700, #D4AF37);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
          transform: translateY(-2px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          color: rgba(255, 255, 255, 0.7);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        .slide-indicators {
          position: absolute;
          bottom: 60px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 5;
        }

        .slide-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slide-dot.active {
          background: #D4AF37;
          border-color: #D4AF37;
          transform: scale(1.2);
        }

        .slide-dot:hover {
          border-color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 280px;
          }

          .slide-indicators {
            bottom: 20px;
            right: 20px;
            flex-direction: row;
          }

          .scroll-indicator {
            bottom: 80px;
          }
        }
      `}</style>

      <section className="hero">
        <div className="hero-background">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoLoaded(false)}
          >
            <source src="https://caffedelbello.com/video/caffedelbello.mp4" type="video/mp4" />
          </video>
          <div className="video-fallback" />
          <div className="hero-gradient"></div>
          <div className="hero-overlay"></div>
          <div className="animated-elements"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-part">{slide.title.split(' ').slice(0, -1).join(' ')}</span>
              <span className="title-highlight">{slide.title.split(' ').slice(-1)[0]}</span>
            </h1>

            <div className="hero-subtitle">{slide.subtitle}</div>

            <p className="hero-description">{slide.description}</p>

            <div className="hero-buttons">
              <button 
                className="btn-primary"
                onClick={() => {
                  // If the CTA is "Browse Courses", navigate to courses page
                  if (slide.cta === "Browse Courses") {
                    onNavigate('courses', 'courses');
                  }
                  // For other CTAs, you can add specific actions here
                }}
              >
                <span>{slide.cta}</span>
              </button>
              <button className="btn-secondary">
                <span>Schedule Visit</span>
              </button>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <ChevronDown />
        </div>

        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slide-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutHero;