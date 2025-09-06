import React from 'react'
import './MissionSection.css'
import { useTranslation } from "/src/useTranslation";

const MissionSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="about-mission-unique">
      <div className="container-unique">
        <div className="mission-content-unique">
          <h2>{t('OurMission')}</h2>
          <p>
        {t('MissionParagraph')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default MissionSection