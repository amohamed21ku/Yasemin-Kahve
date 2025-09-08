import React from 'react'
import { useTranslate } from '../../../useTranslate'
import './TabContent.css'
import './InstructorTab.css'

const InstructorTab = ({ courseDetails, getLocalizedText }) => {
  const { t } = useTranslate()
  if (!courseDetails.instructor) {
    return null
  }

  return (
    <div className="tab-content">
      <div className="instructor-profile">
        <img 
          src={courseDetails.instructor.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23D2691E'/%3E%3Ccircle cx='60' cy='45' r='18' fill='white'/%3E%3Cpath d='M24 96c0-19.882 16.118-36 36-36s36 16.118 36 36' fill='white'/%3E%3C/svg%3E"}
          alt={courseDetails.instructor.name || 'Instructor'}
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23D2691E'/%3E%3Ccircle cx='60' cy='45' r='18' fill='white'/%3E%3Cpath d='M24 96c0-19.882 16.118-36 36-36s36 16.118 36 36' fill='white'/%3E%3C/svg%3E"
          }}
        />
        <div className="instructor-info">
          <h3>{courseDetails.instructor.name || 'Course Instructor'}</h3>
          {courseDetails.instructor.title && (
            <p className="instructor-title">{getLocalizedText(courseDetails.instructor.title)}</p>
          )}
          <p className="instructor-bio">
            {getLocalizedText(courseDetails.instructor.bio) || 
             t("instructorBio") || 
             "Experienced professional passionate about sharing knowledge and helping students develop their skills."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InstructorTab