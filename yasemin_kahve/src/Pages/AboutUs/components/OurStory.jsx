import React from 'react'
import './OurStory.css'
import { useTranslation } from "/src/useTranslation";


const OurStory = () => {
const { t } = useTranslation();
  
  return (
    <section className="about-story">
      <div className="container">
        <div className="story-content">
          <div className="story-text">
            <h2>{t('OurJourney')}</h2>
            <p>
              {t('aboutParagraph1')}
            </p>
            <p>
            {t('aboutParagraph2')}
            </p>
            <p>
            {t('aboutParagraph3')}
            </p>
          </div>
          <div className="story-image">
            <img src="/static/images/assets/van.png" alt="Yasemin Kahve Heritage" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory