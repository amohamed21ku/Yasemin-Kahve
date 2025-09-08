import React from 'react'
import { Clock, Calendar, Users, Star, CheckCircle, Monitor, MapPin } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { useAuth } from '../../../AuthContext'
import './CourseCard.css'

const CourseCard = ({ course, onClick, onEnroll }) => {
  const { t, language } = useTranslation()
  const { currentUser } = useAuth()

  // Safety check - if course is null or undefined, don't render
  if (!course || typeof course !== 'object') {
    console.error('CourseCard: Invalid course data', course)
    return null
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(course)
    }
  }

  const handleEnrollClick = (e) => {
    e.stopPropagation()
    if (onEnroll) {
      onEnroll(course)
    }
  }

  // Helper function to get localized content
  const getLocalizedText = (textObj, fallback = '') => {
    try {
      if (textObj && typeof textObj === 'object') {
        return textObj[language] || textObj.en || textObj.tr || fallback
      }
      return textObj || fallback
    } catch (error) {
      console.error('Error getting localized text:', error)
      return fallback
    }
  }

  const formatPrice = (price) => {
    try {
      if (!price || isNaN(price)) return '₺0'
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    } catch (error) {
      console.error('Error formatting price:', error)
      return `₺${price || 0}`
    }
  }

  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateStr || ''
    }
  }

  const isEnrolled = currentUser && course.enrolledStudents?.includes(currentUser.uid)
  const isFull = course.enrolledStudents?.length >= course.maxStudents

  return (
    <div className={`course-card ${isEnrolled ? 'enrolled' : ''}`} onClick={handleCardClick}>
      <div className="course-image">
        <img
          src={course.image}
          alt={getLocalizedText(course.title)}
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f5f0'/%3E%3Cg fill='%23D2691E'%3E%3Ccircle cx='150' cy='80' r='20'/%3E%3Cellipse cx='150' cy='130' rx='30' ry='20'/%3E%3C/g%3E%3Ctext x='150' y='170' text-anchor='middle' fill='%238B4513' font-size='14'%3ECoffee Course%3C/text%3E%3C/svg%3E"
          }}
        />
        <div className="course-overlay">
          <div className="course-badges">
            <div className="course-level">{getLocalizedText(course.level)}</div>
            <div className="course-type" data-type={course.courseType || 'On Site'}>
              {course.courseType === 'Online' ? (
                <><Monitor size={12} /> {t("online") || "Online"}</>
              ) : (
                <><MapPin size={12} /> {t("onSite") || "On Site"}</>
              )}
            </div>
          </div>
          <div className="course-rating">
            <Star size={14} fill="currentColor" />
            <span>{course.rating || '4.8'}</span>
          </div>
        </div>
        {isEnrolled && (
          <div className="enrolled-badge">
            <CheckCircle size={16} />
            <span>{t("enrolled") || "Enrolled"}</span>
          </div>
        )}
      </div>

      <div className="course-info">
        <h3 className="course-title">{getLocalizedText(course.title)}</h3>
        <p className="course-description">{getLocalizedText(course.shortDescription)}</p>
        
        <div className="course-meta">
          <div className="course-meta-item">
            <Clock size={14} />
            <span>{course.duration} {t("days") || "days"}</span>
          </div>
          <div className="course-meta-item">
            <Calendar size={14} />
            <span>{formatDate(course.startDate)}</span>
          </div>
          <div className="course-meta-item">
            <Users size={14} />
            <span>{course.enrolledStudents?.length || 0}/{course.maxStudents}</span>
          </div>
          {course.location && course.courseType !== 'Online' && (
            <div className="course-meta-item">
              <MapPin size={14} />
              <span>{getLocalizedText(course.location)}</span>
            </div>
          )}
        </div>

        {course.instructor && (
          <div className="course-instructor">
            <img 
              src={course.instructor.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23D2691E'/%3E%3Ccircle cx='20' cy='15' r='6' fill='white'/%3E%3Cpath d='M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12' fill='white'/%3E%3C/svg%3E"} 
              alt={course.instructor.name || 'Instructor'}
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23D2691E'/%3E%3Ccircle cx='20' cy='15' r='6' fill='white'/%3E%3Cpath d='M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12' fill='white'/%3E%3C/svg%3E"
              }}
            />
            <div>
              <span className="instructor-name">{course.instructor.name || 'Unknown Instructor'}</span>
              <span className="instructor-title">{getLocalizedText(course.instructor.title, 'Instructor')}</span>
            </div>
          </div>
        )}

        <div className="course-footer">
          <div className="course-price">
            <span className="price-current">{formatPrice(course.price)}</span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="price-original">{formatPrice(course.originalPrice)}</span>
            )}
          </div>
          
          <button 
            className={`course-enroll-btn ${isEnrolled ? 'enrolled' : isFull ? 'full' : ''}`}
            onClick={handleEnrollClick}
            disabled={isFull && !isEnrolled}
          >
            {isEnrolled ? (
              <>
                <CheckCircle size={16} />
                {t("viewCourse") || "View Course"}
              </>
            ) : isFull ? (
              t("courseFull") || "Full"
            ) : (
              t("enroll") || "Enroll Now"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard