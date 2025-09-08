import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, Users, Star, MapPin } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './CourseHero.css'

const CourseHero = ({ course, onNavigate, getLocalizedText, formatDate }) => {
  const { t} = useTranslate()
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  // Use only the course thumbnail/image for background with fallback
  const getThumbnailImage = () => {
    return course.image || course.thumbnail || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23D2691E'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='white' font-size='24'%3E☕ Coffee Course%3C/text%3E%3C/svg%3E"
  }

  const handleBackClick = () => {
    onNavigate('academy')
  }

  const thumbnailImage = getThumbnailImage()

  const courseDetails = {
    ...course,
   
  }

  return (
    <div className="course-detail-hero">
      <div className="course-detail-background">
        <div
          className="background-image active"
          style={{
            backgroundImage: `url(${thumbnailImage})`,
            opacity: 0.3,
            filter: 'brightness(0.4) contrast(1.2)'
          }}
        />
        <div className="course-detail-overlay"></div>
      </div>
      
      <div 
        className="course-detail-content"
        style={{
          backgroundImage: `url(${thumbnailImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="course-detail-content-overlay"></div>
        <div className="course-detail-content-inner">
          <button onClick={handleBackClick} className="back-btn">
          <ArrowLeft size={20} />
          {t("backToAcademy") || "Back to Academy"}
        </button>
        
        <div className="course-detail-info">
          <div className="course-badge">
            {getLocalizedText(course.level)}
          </div>
          
          <h1 className="course-detail-title">{getLocalizedText(course.title)}</h1>
          
          <div className="course-detail-meta">
            <div className="course-rating">
              <Star size={16} fill="currentColor" />
              <span>{course.rating}</span>
              <span>({course.enrolledStudents?.length || 0} students)</span>
            </div>
            
            <div className="course-meta-items">
              <div className="course-detail-meta-item">
                <Clock size={16} />
                <span>{course.duration} {t("days") || "days"}</span>
              </div>
              <div className="course-detail-meta-item">
                <Calendar size={16} />
                <span>{formatDate(course.startDate)}</span>
              </div>
              <div className="course-detail-meta-item">
                <Users size={16} />
                <span>{course.enrolledStudents?.length || 0}/{course.maxStudents}</span>
              </div>
              <div className="course-detail-meta-item">
                <MapPin size={16} />
                <span>{getLocalizedText(courseDetails.location)}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default CourseHero