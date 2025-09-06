import React from 'react'
import { GraduationCap, Clock, Users, Award } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import './AcademyHero.css'

const AcademyHero = () => {
  const { t } = useTranslation()

  return (
    <section className="academy-hero">
      <div className="academy-hero-background">
        <img 
          src="/static/images/assets/academy-hero.jpg" 
          alt="Yasemin Kahve Academy" 
          className="academy-hero-image"
          onError={(e) => {
            // Fallback to a coffee training scene
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFF8E1'/%3E%3Cstop offset='100%25' style='stop-color:%23FFECB3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23bg)'/%3E%3Cg fill='%23D2691E' opacity='0.1'%3E%3Ccircle cx='200' cy='150' r='20'/%3E%3Ccircle cx='400' cy='100' r='15'/%3E%3Ccircle cx='600' cy='200' r='25'/%3E%3Ccircle cx='800' cy='120' r='18'/%3E%3Ccircle cx='1000' cy='180' r='22'/%3E%3C/g%3E%3Ctext x='600' y='320' text-anchor='middle' fill='%238B4513' font-size='48' font-weight='bold'%3EYasemin Kahve Academy%3C/text%3E%3C/svg%3E"
          }}
        />
        <div className="academy-hero-overlay"></div>
      </div>
      
      <div className="academy-hero-content">
        <div className="academy-hero-text">
          <div className="academy-badge">
            <GraduationCap size={24} />
            <span>{t("academy") || "Academy"}</span>
          </div>
          
          <h1 className="academy-hero-title">
            {t("academyHeroTitle") || "Master the Art of Coffee"}
          </h1>
          
          <p className="academy-hero-description">
            {t("academyHeroDescription") || "Join Yasemin Kahve Academy and learn from industry experts. From bean to cup, discover the secrets of exceptional coffee through our comprehensive courses."}
          </p>
          
          <div className="academy-stats">
            <div className="academy-stat">
              <Users size={20} />
              <div>
                <span className="stat-number">500+</span>
                <span className="stat-label">{t("students") || "Students"}</span>
              </div>
            </div>
            
            <div className="academy-stat">
              <Clock size={20} />
              <div>
                <span className="stat-number">12</span>
                <span className="stat-label">{t("courses") || "Courses"}</span>
              </div>
            </div>
            
            <div className="academy-stat">
              <Award size={20} />
              <div>
                <span className="stat-number">100%</span>
                <span className="stat-label">{t("certified") || "Certified"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AcademyHero