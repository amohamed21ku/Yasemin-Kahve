import React from 'react';
import { BookOpen, Users, Award, Coffee, Play, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../useTranslation';
import './AcademyHero.css';

const AcademyHero = () => {
  const { t } = useTranslation();

  const handleVideoPlay = () => {
    // Video play functionality can be implemented here
    console.log('Play academy introduction video');
  };

  const scrollToCourses = () => {
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
  );
};

export default AcademyHero;