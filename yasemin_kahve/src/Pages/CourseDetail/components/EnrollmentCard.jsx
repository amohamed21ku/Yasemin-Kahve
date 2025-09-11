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
        onClick={isEnrolled ? () => onNavigate('course-page', null, null, course) : handleEnrollClick}
        disabled={isFull && !isEnrolled}
      >
        {isEnrolled ? (
          <>
            <CheckCircle size={20} />
            {t("viewCourse") || "View Course"}
          </>
        ) : isFull ? (
          t("courseFull") || "Course Full"
        ) : (
          t("enrollNow") || "Enroll Now"
        )}
      </button>


    </div>
  )
}

export default EnrollmentCard