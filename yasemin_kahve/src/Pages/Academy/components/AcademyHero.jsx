import React, { useState } from 'react';
import { BookOpen, Users, Award, Coffee, Play, ArrowRight, X } from 'lucide-react';
import { useTranslation } from '../../../useTranslation';
import './AcademyHero.css';

const AcademyHero = () => {
  const { t } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoPlay = () => {
    console.log('Video play button clicked');
    setShowVideo(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    document.body.style.overflow = 'unset';
  };

  const scrollToCourses = () => {
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="academy-hero">
        {/* Background decorative elements */}
        <div className="hero-Academy-background">
          <div className="coffee-bean coffee-bean-1"></div>
          <div className="coffee-bean coffee-bean-2"></div>
          <div className="coffee-bean coffee-bean-3"></div>
          <div className="coffee-bean coffee-bean-4"></div>
          <div className="coffee-bean coffee-bean-5"></div>
          <div className="coffee-steam steam-1"></div>
          <div className="coffee-steam steam-2"></div>
          <div className="coffee-steam steam-3"></div>
          <div className="coffee-steam steam-4"></div>
          <div className="floating-particle particle-1"></div>
          <div className="floating-particle particle-2"></div>
          <div className="floating-particle particle-3"></div>
          <div className="floating-particle particle-4"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
        </div>

        <div className="container">
          <div className="hero-Academy-content">
            {/* Left side - Content */}
            <div className="hero-text">
              <div className="hero-badge">
                <Coffee className="badge-icon" />
                <span>{t('coffeeMastery') || 'Coffee Mastery'}</span>
              </div>

              <h1 className="hero-title">
                <span className="title-main">{t('yaseminCoffeeAcademy') || 'Yasemin Coffee Academy'}</span>
                <span className="title-subtitle">{t('masterTheArtOfCoffee') || 'Master the Art of Coffee'}</span>
              </h1>

              <p className="hero-Academy-description">
                {t('academyDescription') }
              </p>

              {/* Action buttons */}
              <div className="hero-actions">
                <button className="btn-Academy-primary" onClick={scrollToCourses}>
                  <span>{t('exploreCourses') || 'Explore Courses'}</span>
                  <ArrowRight className="btn-icon" />
                </button>
                <button className="btn-Academy-secondary" onClick={handleVideoPlay}>
                  <Play className="btn-icon" />
                  <span>{t('watchIntro') || 'Watch Introduction'}</span>
                </button>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="hero-visual">
              <div className="visual-container">
                <div className="main-image">
                  <div className="image-placeholder">
                    <Coffee size={80} />
                  </div>
                  <div className="floating-Academy-element element-1">
                    <BookOpen size={24} />
                  </div>
                  <div className="floating-Academy-element element-2">
                    <Award size={28} />
                  </div>
                  <div className="floating-Academy-element element-3">
                    <Users size={26} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal - Outside section to avoid overflow issues */}
      {showVideo && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={handleCloseVideo}>
              <X size={24} />
            </button>
            <video
              controls
              autoPlay
              className="academy-video"
              key="academy-intro-video"
            >
              <source src="/static/images/assets/Academy_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default AcademyHero;
