import React from 'react'
import { CheckCircle, Award } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './TabContent.css'

const OverviewTab = ({ courseDetails, getLocalizedText }) => {
  const { t } = useTranslate()
  return (
    <div className="tab-content">
      <h3>{t("courseDescription") || "Course Description"}</h3>
      <p>{getLocalizedText(courseDetails.fullDescription)}</p>
      
      {/* Additional overview sections */}
      {courseDetails.overviewSections && courseDetails.overviewSections.length > 0 && (
        <div className="additional-sections">
          {courseDetails.overviewSections.map((section) => (
            <div key={section.id} className="overview-section">
              {getLocalizedText(section.subtitle) && (
                <h3>{getLocalizedText(section.subtitle)}</h3>
              )}
              {getLocalizedText(section.content) && (
                <p>{getLocalizedText(section.content)}</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Only show prerequisites if they exist and are not empty */}
      {courseDetails.prerequisites && getLocalizedText(courseDetails.prerequisites) && (
        <>
          <h3>{t("prerequisites") || "Prerequisites"}</h3>
          <p>{getLocalizedText(courseDetails.prerequisites)}</p>
        </>
      )}
      
      {/* Only show materials if they exist */}
      {courseDetails.materials && courseDetails.materials.length > 0 && (
        <>
          <h3>{t("includedMaterials") || "What's Included"}</h3>
          <ul className="materials-list">
            {courseDetails.materials.map((material, index) => (
              <li key={index}>
                <CheckCircle size={16} />
                {getLocalizedText(material)}
              </li>
            ))}
          </ul>
        </>
      )}
      
      <h3>{t("certification") || "Certification"}</h3>
      <div className="certificate-info">
        <Award size={20} />
        <p>{getLocalizedText(courseDetails.certificate)}</p>
      </div>
    </div>
  )
}

export default OverviewTab