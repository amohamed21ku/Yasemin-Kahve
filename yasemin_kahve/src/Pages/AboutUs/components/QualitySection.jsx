import React from 'react'
import { Award, Coffee, Truck } from 'lucide-react'
import { useTranslation } from '/src/useTranslation'
import './QualitySection.css'

const QualitySection = () => {
  const { t } = useTranslation()
  return (
    <section className="about-quality-unique">
      <div className="container-quality-unique">
        <h2>{t('farmToCupExcellence')}</h2>
        <p className="quality-about-intro">
          {t('qualityIntroText')}
        </p>
        
        <div className="quality-features">
          <div className="quality-card">
            <Award className="quality-icon" />
            <h3>{t('centuryOfExpertise')}</h3>
          </div>
          
          <div className="quality-card">
            <Coffee className="quality-icon" />
            <h3>{t('familyOwnedFarms')}</h3>
          </div>
          
          <div className="quality-card">
            <Truck className="quality-icon" />
            <h3>{t('globalDistribution')}</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QualitySection