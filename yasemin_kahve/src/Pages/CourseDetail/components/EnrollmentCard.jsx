import React from 'react'
import { CheckCircle, Play, Download } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './EnrollmentCard.css'

const EnrollmentCard = ({ course, formatPrice, isEnrolled, isFull, handleEnrollClick, onNavigate }) => {
  const { t } = useTranslate()
  return (
    <div className="course-enroll-card">
      <div className="course-detail-price">
        <span className="price-detail-current">{formatPrice(course.price)}</span>
        {course.originalPrice && course.originalPrice > course.price && (
          <span className="price-detail-original">{formatPrice(course.originalPrice)}</span>
        )}
      </div>
      
      <button 
        className={`enroll-btn ${isEnrolled ? 'enrolled' : isFull ? 'full' : ''}`}
        onClick={handleEnrollClick}
        disabled={isFull && !isEnrolled}
      >
        {isEnrolled ? (
          <>
            <CheckCircle size={20} />
            {t("enrolled") || "Enrolled"}
          </>
        ) : isFull ? (
          t("courseFull") || "Course Full"
        ) : (
          t("enrollNow") || "Enroll Now"
        )}
      </button>

      {isEnrolled && (
        <div className="enrolled-actions">
          <button 
            className="action-btn"
            onClick={() => onNavigate('course-page', null, null, course)}
          >
            <Play size={16} />
            {t("continueLearn") || "Continue Learning"}
          </button>
          <button className="action-btn secondary">
            <Download size={16} />
            {t("downloadMaterials") || "Download Materials"}
          </button>
        </div>
      )}
    </div>
  )
}

export default EnrollmentCard