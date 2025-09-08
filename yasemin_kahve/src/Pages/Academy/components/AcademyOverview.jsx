import React from 'react';
import { Heart, Users, Coffee, Award, BookOpen, Star, Play } from 'lucide-react';
import { useTranslation } from '/src/useTranslation';
import './AcademyOverview.css';

const AcademyOverview = () => {
  const { t } = useTranslation();

  return (
    <section className="academy-overview">
      <div className="container">
        {/* Section Header */}
        <div className="overview-header">
          <div className="header-content">
            <h2 className="section-title">
              {t('discoverYourPassion') || 'Discover Your Coffee Passion'}
            </h2>
            <p className="section-description">
              {t('academyOverviewDescription') || 'At Yasemin Coffee Academy, we transform coffee enthusiasts into skilled artisans. Our comprehensive programs blend traditional Turkish coffee heritage with modern specialty coffee techniques.'}
            </p>
          </div>
          <div className="header-visual">
            <div className="coffee-art-circle">
              <Coffee size={40} />
              <div className="art-dots">
                <span className="dot dot-1"></span>
                <span className="dot dot-2"></span>
                <span className="dot dot-3"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="overview-grid">
          
          {/* Left Column - Story */}
          <div className="story-section">
            <div className="story-card">
              <div className="story-header">
                <Heart className="story-icon" />
                <h3>{t('ourStory') || 'Our Story'}</h3>
              </div>
              <div className="story-content">
                <p>
                  {t('academyStoryText') || 'Founded with a deep love for coffee culture, our academy has been nurturing coffee professionals for years. We believe every cup tells a story, and we\'re here to help you write yours.'}
                </p>
                <div className="story-stats">
                  <div className="stat">
                    <span className="stat-number">150+</span>
                    <span className="stat-label">{t('graduates') || 'Graduates'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">{t('yearsExperience') || 'Years'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mission-card">
              <div className="mission-content">
                <Star className="mission-icon" />
                <h4>{t('ourMission') || 'Our Mission'}</h4>
                <p>
                  {t('missionText') || 'To preserve and share the rich tradition of Turkish coffee while embracing innovation in specialty coffee education.'}
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Visual Gallery */}
          <div className="gallery-section">
            <div className="gallery-container">
              <div className="gallery-item main-image">
                <div className="image-placeholder">
                  <BookOpen size={60} />
                  <div className="image-overlay">
                    <Play className="play-icon" />
                    <span>{t('watchOurStory') || 'Watch Our Story'}</span>
                  </div>
                </div>
              </div>
              
              <div className="gallery-item small-image">
                <div className="image-placeholder">
                  <Users size={30} />
                </div>
              </div>
              
              <div className="gallery-item small-image">
                <div className="image-placeholder">
                  <Coffee size={30} />
                </div>
              </div>
              
              <div className="floating-badge">
                <Award size={20} />
                <span>{t('certified') || 'Certified'}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="features-section">
            <h3 className="features-title">
              {t('whyChooseUs') || 'Why Choose Us?'}
            </h3>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <BookOpen size={20} />
                </div>
                <div className="feature-text">
                  <h4>{t('comprehensiveCurriculum') || 'Comprehensive Curriculum'}</h4>
                  <p>{t('curriculumDesc') || 'From coffee origins to advanced brewing techniques'}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={20} />
                </div>
                <div className="feature-text">
                  <h4>{t('smallClassSizes') || 'Small Class Sizes'}</h4>
                  <p>{t('classDesc') || 'Personalized attention with maximum 8 students per class'}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Coffee size={20} />
                </div>
                <div className="feature-text">
                  <h4>{t('premiumEquipment') || 'Premium Equipment'}</h4>
                  <p>{t('equipmentDesc') || 'Learn with professional-grade coffee equipment'}</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Award size={20} />
                </div>
                <div className="feature-text">
                  <h4>{t('industryRecognition') || 'Industry Recognition'}</h4>
                  <p>{t('recognitionDesc') || 'Certificates recognized by coffee industry leaders'}</p>
                </div>
              </div>
            </div>
            
            <div className="cta-button">
              <button className="overview-btn">
                <span>{t('learnMore') || 'Learn More'}</span>
                <Coffee className="btn-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Call to Action */}
        <div className="bottom-cta">
          <div className="cta-content">
            <h3>{t('readyToStart') || 'Ready to Start Your Coffee Journey?'}</h3>
            <p>{t('ctaDescription') || 'Join hundreds of students who have transformed their passion into expertise'}</p>
            <div className="cta-actions">
              <button className="btn-primary">
                <span>{t('browsePrograms') || 'Browse Programs'}</span>
              </button>
              <button className="btn-secondary">
                <span>{t('scheduleVisit') || 'Schedule a Visit'}</span>
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="success-stories">
              <div className="story-avatar">
                <Users size={24} />
              </div>
              <div className="story-text">
                <span className="story-quote">"{t('testimonial') || 'Best coffee education experience!'}"</span>
                <span className="story-author">{t('studentName') || 'Ahmet K.'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyOverview;