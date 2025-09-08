import React, { useState, useEffect } from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import AcademyHero from './components/AcademyHero'
import CourseGrid from './components/CourseGrid'
import EnrollmentModal from './components/EnrollmentModal'
import CourseFormModal from './components/CourseFormModal'
import SignInModal from '../../Components/SignInModal'
import { useAuth } from '../../AuthContext'
import { useTranslation } from '../../useTranslation'
import './Academy.css'
import AcademyOverview from './components/AcademyOverview'

const Academy = ({ onNavigate }) => {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showCourseFormModal, setShowCourseFormModal] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Add error handling for unhandled promise rejections
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
    // After successful sign in, automatically show enrollment modal
    // Wait longer to ensure currentUser is updated in the auth context
    setTimeout(() => {
      if (selectedCourse && currentUser) {
        setShowEnrollModal(true)
        setSignInModalOpen(false)
      } else {
        // If currentUser is still not available, wait a bit longer
        setTimeout(() => {
          if (selectedCourse && currentUser) {
            setShowEnrollModal(true)
            setSignInModalOpen(false)
          } else {
            console.warn('User authentication state not properly updated after sign-in')
            // Reset state to prevent white screen
            setSelectedCourse(null)
            setSignInModalOpen(false)
          }
        }, 500)
      }
    }, 500)
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

  const handleAddNewCourse = () => {
    setShowCourseFormModal(true)
  }

  const handleCourseFormSubmit = (courseData) => {
    // Handle course creation logic here
    console.log('New course data:', courseData)
    alert(t("courseCreatedSuccess") || "Course created successfully!")
    setShowCourseFormModal(false)
    // In a real app, you would save to database and refresh the course list
  }

  // Error boundary fallback UI
  if (hasError) {
    return (
      <div className="academy-page">
        <Header activeSection="academy" onNavigate={onNavigate} darkContent={true} />
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
        <Header activeSection="academy" onNavigate={onNavigate} darkContent={true} />
        
        <AcademyHero />
        {/* <AcademyOverview /> */}
        
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

        {/* Course Form Modal */}
        <CourseFormModal
          isOpen={showCourseFormModal}
          onClose={() => setShowCourseFormModal(false)}
          onSubmit={handleCourseFormSubmit}
        />

        {/* Sign In Modal */}
        <SignInModal
          isOpen={signInModalOpen}
          onClose={() => {
            setSignInModalOpen(false)
            setSelectedCourse(null)
          }}
          onSuccess={handleSignInSuccess}
        />
      </div>
    )
  } catch (error) {
    console.error('Academy page error:', error)
    setHasError(true)
    return null
  }
}

export default Academy