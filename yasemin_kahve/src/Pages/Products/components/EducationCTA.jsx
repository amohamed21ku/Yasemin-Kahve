import React from 'react'
import { useTranslation } from "/src/useTranslation";


const EducationCTA = ({ onNavigate }) => {
    const { t } = useTranslation();
  
  return (
    <section className="education-cta">
      <div className="container">
        <div className="cta-content">
          <h2>{t("LearnArtCoffee")}</h2>
          <p>
            {t("masterThe")}
          </p>
          <button 
            className="cta-button"
            onClick={() => onNavigate && onNavigate('academy')}
          >
             {t("exploreOurAcademy")}
          </button>
        </div>
      </div>
    </section>
  )
}

export default EducationCTA