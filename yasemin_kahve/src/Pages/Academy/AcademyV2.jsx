import React, { useState, useEffect } from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import CourseGrid from './components/CourseGrid'
import EnrollmentModal from './components/EnrollmentModal'
import CourseFormModal from './components/CourseFormModal'
import SignInModal from '../../Components/SignInModal'
import SuccessNotification from '../../Components/SuccessNotification'
import { useAuth } from '../../AuthContext'
import { useTranslation } from '../../useTranslation'
import './Academy.css'
import ShuffleHero from './components/ShuffleHero'

const AcademyV2 = ({ onNavigate }) => {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showCourseFormModal, setShowCourseFormModal] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [enrolledCourse, setEnrolledCourse] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setHasError(true)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    onNavigate('course-detail', null, course)
  }

  const handleEnroll = (course) => {
    if (!currentUser) {
      setSelectedCourse(course)
      setSignInModalOpen(true)
      return
    }
    
    setSelectedCourse(course)
    setShowEnrollModal(true)
  }

  const handleSignInSuccess = () => {
    setTimeout(() => {
      if (selectedCourse && currentUser) {
        setShowEnrollModal(true)
        setSignInModalOpen(false)
      } else {
        setTimeout(() => {
          if (selectedCourse && currentUser) {
            setShowEnrollModal(true)
            setSignInModalOpen(false)
          } else {
            console.warn('User authentication state not properly updated after sign-in')
            setSelectedCourse(null)
            setSignInModalOpen(false)
          }
        }, 500)
      }
    }, 500)
  }

  const handleEnrollComplete = async (course) => {
    try {
      console.log('Enrolling user in course:', course.title)
      
      setEnrolledCourse(course)
      setShowSuccessNotification(true)
      setShowEnrollModal(false)
      setSelectedCourse(null)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(t("enrollmentError") || "An error occurred during enrollment. Please try again.")
    }
  }

  const handleAddNewCourse = () => {
    setShowCourseFormModal(true)
  }

  const handleCourseFormSubmit = (courseData) => {
    console.log('New course data:', courseData)
    alert(t("courseCreatedSuccess") || "Course created successfully!")
    setShowCourseFormModal(false)
  }

  if (hasError) {
    return (
      <div className="academy-page">
        <Header activeSection="academy" onNavigate={onNavigate} />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh', 
          padding: '2rem',
          textAlign: 'center' 
        }}>
          <h2>Something went wrong</h2>
          <p>We're having trouble loading the academy page. Please try refreshing or come back later.</p>
          <button 
            onClick={() => setHasError(false)} 
            style={{ 
              padding: '0.5rem 1rem', 
              margin: '1rem',
              backgroundColor: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  try {
    return (
      <div className="academy-page">
        <Header activeSection="academy" onNavigate={onNavigate} />
        
        <ShuffleHero />
        
        <div className="academy-content">
          <CourseGrid 
            onCourseClick={handleCourseClick}
            onEnroll={handleEnroll}
            refreshTrigger={refreshTrigger}
          />
        </div>
        
        <Footer />
        
        <EnrollmentModal
          course={selectedCourse}
          isOpen={showEnrollModal}
          onClose={() => {
            setShowEnrollModal(false)
            setSelectedCourse(null)
          }}
          onEnroll={handleEnrollComplete}
        />

        <CourseFormModal
          isOpen={showCourseFormModal}
          onClose={() => setShowCourseFormModal(false)}
          onSubmit={handleCourseFormSubmit}
        />

        <SignInModal
          isOpen={signInModalOpen}
          onClose={() => {
            setSignInModalOpen(false)
            setSelectedCourse(null)
          }}
          onSuccess={handleSignInSuccess}
        />

        <SuccessNotification
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          title="Successfully Enrolled!"
          message="Our team will contact you shortly with course details and next steps."
        />
      </div>
    )
  } catch (error) {
    console.error('Academy page error:', error)
    setHasError(true)
    return null
  }
}

export default AcademyV2