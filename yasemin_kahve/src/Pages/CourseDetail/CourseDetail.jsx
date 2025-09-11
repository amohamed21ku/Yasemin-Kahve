import React, { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Play, Download } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import CourseHero from './components/CourseHero'
import CourseTabs from './components/CourseTabs'
import OverviewTab from './components/OverviewTab'
import CurriculumTab from './components/CurriculumTab'
import InstructorTab from './components/InstructorTab'
import MediaTab from './components/MediaTab'
import EnrollmentCard from './components/EnrollmentCard'
import ImageViewer from './components/ImageViewer'
import VideoViewer from './components/VideoViewer'
import EnrollmentModal from '/src/Pages/Academy/components/EnrollmentModal'
import SuccessNotification from '../../Components/SuccessNotification'

import SignInModal from '../../Components/SignInModal'
import { useTranslate } from '../../useTranslate'
import { useAuth } from '../../AuthContext'
import './CourseDetail.css'
const CourseDetail = ({ course, onNavigate, onEnroll }) => {
  const { t, language } = useTranslate()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [videoViewerOpen, setVideoViewerOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [enrolledCourse, setEnrolledCourse] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Helper function to get localized content
  const getLocalizedText = (textObj, fallback = '') => {
    if (textObj && typeof textObj === 'object') {
      return textObj[language] || textObj.en || textObj.tr || fallback
    }
    return textObj || fallback
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isEnrolled = currentUser && course?.enrolledStudents?.includes(currentUser.uid)
  const isFull = course?.enrolledStudents?.length >= course?.maxStudents

  const handleEnrollClick = () => {
    if (!currentUser) {
      setSignInModalOpen(true)
      return
    }
    
    // Show the enrollment modal instead of directly enrolling
    setShowEnrollModal(true)
  }

  const handleEnrollComplete = async (course) => {
    try {
      console.log('Enrolling user in course:', course.title)
      
      // If there's a parent onEnroll function, call it
      if (onEnroll) {
        await onEnroll(course)
      }
      
      setEnrolledCourse(course)
      setShowSuccessNotification(true)
      setShowEnrollModal(false)
    } catch (error) {
      console.error('Enrollment error:', error)
      alert(t("enrollmentError") || "An error occurred during enrollment. Please try again.")
    }
  }

  const handleSignInSuccess = () => {
    setIsProcessing(true)
    
    // After successful sign in, show enrollment modal
    setTimeout(() => {
      setIsProcessing(false)
      setSignInModalOpen(false)
      
      // Wait a bit more to ensure auth state is updated
      setTimeout(() => {
        setShowEnrollModal(true)
      }, 500)
    }, 1000)
  }

  // Image viewer functions
  const openImageViewer = (index) => {
    setCurrentImageIndex(index)
    setImageViewerOpen(true)
  }

  const closeImageViewer = () => {
    setImageViewerOpen(false)
  }

  const nextImage = () => {
    const images = courseDetails.additionalImages || []
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = courseDetails.additionalImages || []
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Video viewer functions
  const openVideoViewer = (index) => {
    setCurrentVideoIndex(index)
    setVideoViewerOpen(true)
  }

  const closeVideoViewer = () => {
    setVideoViewerOpen(false)
  }

  const nextVideo = () => {
    const videos = courseDetails.videos || []
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    const videos = courseDetails.videos || []
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  // Use course data with fallbacks
  const courseDetails = {
    ...course,
    fullDescription: course.fullDescription || {
      en: "This comprehensive course will provide you with in-depth knowledge and practical skills.",
      tr: "Bu kapsamlı kurs size derinlemesine bilgi ve pratik beceriler sağlayacak."
    },
    curriculum: course.curriculum || [],

    materials: course.materials || [
      { en: "Course materials", tr: "Kurs materyalleri" },
      { en: "Practical exercises", tr: "Pratik alıştırmalar" }
    ],
    certificate: course.certificate || {
      en: "Upon completion, you'll receive a Yasemin Kahve Academy Certificate",
      tr: "Tamamlandığında, Yasemin Kahve Akademisi Sertifikası alacaksınız"
    },
    location: course.location || {
      en: "Yasemin Kahve Academy, Istanbul",
      tr: "Yasemin Kahve Akademisi, İstanbul"
    }
  }

  // Show tabs conditionally based on available data
  const tabs = [
    { id: 'overview', label: t("overview") || "Overview" },
    ...(courseDetails.curriculum && courseDetails.curriculum.length > 0 
      ? [{ id: 'curriculum', label: t("curriculum") || "Curriculum" }] 
      : []),
    ...(courseDetails.instructor 
      ? [{ id: 'instructor', label: t("instructor") || "Instructor" }] 
      : []),
    { id: 'media', label: t("media") || "Media" }
  ]

  if (!course) {
    return (
      <div className="course-detail-page">
        <Header activeSection="academy" onNavigate={onNavigate} darkContent={true} />
        <div className="course-not-found">
          <h2>{t("courseNotFound") || "Course not found"}</h2>
          <button onClick={() => onNavigate('academy')} className="back-btn">
            <ArrowLeft size={20} />
            {t("backToAcademy") || "Back to Academy"}
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="course-detail-page">
      <Header activeSection="academy" onNavigate={onNavigate} darkContent={true} />
      
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          color: 'white',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            {t('processing') || 'Processing...'}
          </div>
        </div>
      )}
      
      <CourseHero 
        course={course}
        onNavigate={onNavigate}
        getLocalizedText={getLocalizedText}
        formatDate={formatDate}
      />

      <div className="course-detail-body">
        <div className="course-content">
          <CourseTabs 
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="course-tab-content">
            {activeTab === 'overview' && (
              <OverviewTab 
                courseDetails={courseDetails}
                getLocalizedText={getLocalizedText}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumTab 
                courseDetails={courseDetails}
                getLocalizedText={getLocalizedText}
                isEnrolled={isEnrolled}
              />
            )}

            {activeTab === 'instructor' && (
              <InstructorTab 
                courseDetails={courseDetails}
                getLocalizedText={getLocalizedText}
              />
            )}

            {activeTab === 'media' && (
              <MediaTab 
                courseDetails={courseDetails}
                openImageViewer={openImageViewer}
                openVideoViewer={openVideoViewer}
              />
            )}
          </div>
        </div>

        <div className="course-sidebar">
          {isEnrolled ? (
            <div className="enrolled-status-card">
              <div className="enrolled-header">
                <div className="enrolled-icon">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3>{t("enrolledInCourse") || "You're Enrolled!"}</h3>
                  <p>{t("enrolledMessage") || "You have successfully enrolled in this course"}</p>
                </div>
              </div>
            
            </div>
          ) : (
            <EnrollmentCard 
              course={course}
              formatPrice={formatPrice}
              isEnrolled={isEnrolled}
              isFull={isFull}
              handleEnrollClick={handleEnrollClick}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
      
      <Footer />

      <ImageViewer 
        isOpen={imageViewerOpen}
        images={courseDetails.additionalImages || []}
        currentIndex={currentImageIndex}
        onClose={closeImageViewer}
        onNext={nextImage}
        onPrev={prevImage}
      />

      <VideoViewer 
        isOpen={videoViewerOpen}
        videos={courseDetails.videos || []}
        currentIndex={currentVideoIndex}
        onClose={closeVideoViewer}
        onNext={nextVideo}
        onPrev={prevVideo}
      />

      {/* Enrollment Modal */}
      <EnrollmentModal
        course={course}
        isOpen={showEnrollModal}
        onClose={() => {
          setShowEnrollModal(false)
        }}
        onEnroll={handleEnrollComplete}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
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
}

export default CourseDetail