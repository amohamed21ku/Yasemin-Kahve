import React, { useState } from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import AcademyHero from './components/AcademyHero'
import CourseGrid from './components/CourseGrid'
import EnrollmentModal from './components/EnrollmentModal'
import { useAuth } from '../../AuthContext'
import { useTranslation } from '../../useTranslation'
import './Academy.css'
import AcademyOverview from './components/AcademyOverview'

const Academy = ({ onNavigate }) => {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showEnrollModal, setShowEnrollModal] = useState(false)

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    onNavigate('course-detail', null, course)
  }

  const handleEnroll = (course) => {
    if (!currentUser) {
      // Redirect to login/register if not authenticated
      onNavigate('register')
      return
    }
    
    setSelectedCourse(course)
    setShowEnrollModal(true)
  }

  const handleEnrollComplete = async (course) => {
    try {
      // In a real app, you would:
      // 1. Update the course enrollment in Firebase/database
      // 2. Add the course to user's enrolled courses
      // 3. Send confirmation email
      
      console.log('Enrolling user in course:', course.title)
      
      // For now, just show success message
      alert(t("enrollmentSuccess") || "Successfully enrolled in the course!")
      
      setShowEnrollModal(false)
      setSelectedCourse(null)
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(t("enrollmentError") || "An error occurred during enrollment. Please try again.")
    }
  }

  return (
    <div className="academy-page">
      <Header activeSection="academy" onNavigate={onNavigate} />
      
      <AcademyHero />
      <AcademyOverview />
      
      <div className="academy-content">
        <CourseGrid 
          onCourseClick={handleCourseClick}
          onEnroll={handleEnroll}
        />
      </div>
      
      <Footer />
      
      {/* Enrollment Modal */}
      <EnrollmentModal
        course={selectedCourse}
        isOpen={showEnrollModal}
        onClose={() => {
          setShowEnrollModal(false)
          setSelectedCourse(null)
        }}
        onEnroll={handleEnrollComplete}
      />
    </div>
  )
}

export default Academy