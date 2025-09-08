import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
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
import { useTranslate } from '../../useTranslate'
import { useAuth } from '../../AuthContext'
import './CourseDetail.css'

const CourseDetail = ({ course, onNavigate, onEnroll }) => {
  const { t, language } = useTranslate()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      onNavigate('register')
      return
    }
    
    if (onEnroll) {
      onEnroll(course)
    }
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

  // Use course data with fallbacks
  const courseDetails = {
    ...course,
    fullDescription: course.fullDescription || {
      en: "This comprehensive course will provide you with in-depth knowledge and practical skills.",
      tr: "Bu kapsamlı kurs size derinlemesine bilgi ve pratik beceriler sağlayacak."
    },
    curriculum: course.curriculum || [],
    prerequisites: course.prerequisites || {
      en: "No prior experience required. Just bring your enthusiasm to learn!",
      tr: "Önceden deneyim gerekmez. Sadece öğrenme hevesini getirin!"
    },
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
        <Header activeSection="academy" onNavigate={onNavigate} />
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
      <Header activeSection="academy" onNavigate={onNavigate} />
      
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
              />
            )}
          </div>
        </div>

        <div className="course-sidebar">
          <EnrollmentCard 
            course={course}
            formatPrice={formatPrice}
            isEnrolled={isEnrolled}
            isFull={isFull}
            handleEnrollClick={handleEnrollClick}
            onNavigate={onNavigate}
          />
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
    </div>
  )
}

export default CourseDetail