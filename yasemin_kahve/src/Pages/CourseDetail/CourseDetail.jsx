import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, Users, Star, CheckCircle, Play, Download, Award, MapPin, FileText, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { useTranslation } from '../../useTranslation'
import { useAuth } from '../../AuthContext'
import './CourseDetail.css'

const CourseDetail = ({ course, onNavigate, onEnroll }) => {
  const { t, language } = useTranslation()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

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

  const handleBackClick = () => {
    onNavigate('academy')
  }

  // Image viewer functions
  const openImageViewer = (index) => {
    setCurrentImageIndex(index)
    setImageViewerOpen(true)
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden'
  }

  const closeImageViewer = () => {
    setImageViewerOpen(false)
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    const images = courseDetails.additionalImages || []
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const prevImage = () => {
    const images = courseDetails.additionalImages || []
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev * 1.5, 3))
  }

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev / 1.5, 0.5))
  }

  const resetZoom = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!imageViewerOpen) return
      
      switch (e.key) {
        case 'Escape':
          closeImageViewer()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case '0':
          resetZoom()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [imageViewerOpen])

  // Handle touch/swipe for mobile
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    const isUpSwipe = distanceY > 50
    const isDownSwipe = distanceY < -50

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        nextImage()
      }
      if (isRightSwipe) {
        prevImage()
      }
    }
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

  // Get background images from course media or use default
  const getBackgroundImages = () => {
    const images = []
    
    // Prioritize additional images from media first
    if (courseDetails.additionalImages && courseDetails.additionalImages.length > 0) {
      images.push(...courseDetails.additionalImages)
    }
    
    // Add main course image if not already included
    if (course.image && !images.includes(course.image)) {
      images.push(course.image)
    }
    
    // Fallback to default if no images available
    if (images.length === 0) {
      images.push("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23D2691E'/%3E%3Ctext x='400' y='200' text-anchor='middle' fill='white' font-size='24'%3E☕ Coffee Course%3C/text%3E%3C/svg%3E")
    }
    
    return images
  }

  const backgroundImages = getBackgroundImages()

  // Background image carousel effect with smooth transitions
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBgIndex((prevIndex) => 
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        )
      }, 4000) // Change every 4 seconds for more dynamic feel

      return () => clearInterval(interval)
    }
  }, [backgroundImages.length])

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
          <button onClick={handleBackClick} className="back-btn">
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
      
      <div className="course-detail-hero">
        <div className="course-detail-background">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`background-image ${index === currentBgIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: index === currentBgIndex ? 0.4 : 0,
                transform: index === currentBgIndex ? 'scale(1)' : 'scale(1.05)',
                transition: 'all 2s ease-in-out'
              }}
            />
          ))}
          <div className="course-detail-overlay"></div>
          
          {/* Background indicators */}
          {backgroundImages.length > 1 && (
            <div className="background-indicators">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentBgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentBgIndex(index)}
                  aria-label={`Background ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="course-detail-content">
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
                <div className="course-meta-item">
                  <Clock size={16} />
                  <span>{course.duration} {t("hours") || "hours"}</span>
                </div>
                <div className="course-meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(course.startDate)}</span>
                </div>
                <div className="course-meta-item">
                  <Users size={16} />
                  <span>{course.enrolledStudents?.length || 0}/{course.maxStudents}</span>
                </div>
                <div className="course-meta-item">
                  <MapPin size={16} />
                  <span>{getLocalizedText(courseDetails.location)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-detail-body">
        <div className="course-content">
          <div className="course-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="course-tab-content">
            {activeTab === 'overview' && (
              <div className="tab-content">
                <h3>{t("courseDescription") || "Course Description"}</h3>
                <p>{getLocalizedText(courseDetails.fullDescription)}</p>
                
                {/* Additional overview sections */}
                {courseDetails.overviewSections && courseDetails.overviewSections.length > 0 && (
                  <div className="additional-sections">
                    {courseDetails.overviewSections.map((section) => (
                      <div key={section.id} className="overview-section">
                        {getLocalizedText(section.subtitle) && (
                          <h3>{getLocalizedText(section.subtitle)}</h3>
                        )}
                        {getLocalizedText(section.content) && (
                          <p>{getLocalizedText(section.content)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Only show prerequisites if they exist and are not empty */}
                {courseDetails.prerequisites && getLocalizedText(courseDetails.prerequisites) && (
                  <>
                    <h3>{t("prerequisites") || "Prerequisites"}</h3>
                    <p>{getLocalizedText(courseDetails.prerequisites)}</p>
                  </>
                )}
                
                {/* Only show materials if they exist */}
                {courseDetails.materials && courseDetails.materials.length > 0 && (
                  <>
                    <h3>{t("includedMaterials") || "What's Included"}</h3>
                    <ul className="materials-list">
                      {courseDetails.materials.map((material, index) => (
                        <li key={index}>
                          <CheckCircle size={16} />
                          {getLocalizedText(material)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                <h3>{t("certification") || "Certification"}</h3>
                <div className="certificate-info">
                  <Award size={20} />
                  <p>{getLocalizedText(courseDetails.certificate)}</p>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && courseDetails.curriculum && courseDetails.curriculum.length > 0 && (
              <div className="tab-content">
                <h3>{t("courseCurriculum") || "Course Curriculum"}</h3>
                <div className="curriculum-overview">
                  <p>{t("curriculumDescription") || "This course is structured into modules designed to provide you with comprehensive knowledge and practical skills."}</p>
                </div>
                <div className="curriculum-list">
                  {courseDetails.curriculum.map((module, moduleIndex) => (
                    <div key={module.id} className="curriculum-module">
                      <div className="module-header">
                        <div className="module-number">
                          <span>{moduleIndex + 1}</span>
                        </div>
                        <div className="module-info">
                          <h4>{getLocalizedText(module.title)}</h4>
                          <div className="module-meta">
                            <span className="module-duration">
                              <Clock size={14} />
                              {module.duration} {t("hours") || "hours"}
                            </span>
                            {module.lessons && (
                              <span className="topic-count">
                                <FileText size={14} />
                                {module.lessons.length} {module.lessons.length === 1 ? (t("topic") || "topic") : (t("topics") || "topics")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {module.lessons && module.lessons.length > 0 && (
                        <div className="module-content">
                          <div className="topics-list">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="topic-item">
                                <div className="topic-icon">
                                  <FileText size={16} />
                                </div>
                                <div className="topic-details">
                                  <h5 className="topic-title">{getLocalizedText(lesson)}</h5>
                                  {lesson.description && (
                                    <p className="topic-description">{getLocalizedText(lesson.description)}</p>
                                  )}
                                </div>
                                {isEnrolled && (
                                  <div className="topic-status">
                                    <CheckCircle size={16} className="completed" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && courseDetails.instructor && (
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
            )}

            {activeTab === 'media' && (
              <div className="tab-content">
                <h3>{t("courseMedia") || "Course Media"}</h3>
                
                {/* Course Videos */}
                {courseDetails.videos && courseDetails.videos.length > 0 && (
                  <div className="media-section">
                    <h4>{t("videos") || "Videos"}</h4>
                    <div className="media-grid">
                      {courseDetails.videos.map((video, index) => (
                        <div key={index} className="media-item video-item">
                          <div className="media-preview">
                            <Play size={24} />
                            <span>{video.name}</span>
                          </div>
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="media-link">
                            {t("watchVideo") || "Watch Video"}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Additional Images */}
                {courseDetails.additionalImages && courseDetails.additionalImages.length > 0 && (
                  <div className="media-section">
                    <h4>{t("images") || "Images"}</h4>
                    <div className="image-gallery">
                      {courseDetails.additionalImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="gallery-image"
                          onClick={() => openImageViewer(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img src={image} alt={`Course image ${index + 1}`} />
                          <div className="image-overlay">
                            <ZoomIn size={24} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Course Documents */}
                {courseDetails.documents && courseDetails.documents.length > 0 && (
                  <div className="media-section">
                    <h4>{t("documents") || "Documents"}</h4>
                    <div className="documents-list">
                      {courseDetails.documents.map((doc, index) => (
                        <div key={index} className="document-item">
                          <FileText size={20} />
                          <span>{doc.name}</span>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-link">
                            <Download size={16} />
                            {t("download") || "Download"}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No media message */}
                {(!courseDetails.videos || courseDetails.videos.length === 0) &&
                 (!courseDetails.additionalImages || courseDetails.additionalImages.length === 0) &&
                 (!courseDetails.documents || courseDetails.documents.length === 0) && (
                  <div className="no-media">
                    <p>{t("noMediaAvailable") || "No additional media content is available for this course yet."}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="course-sidebar">
          <div className="course-enroll-card">
            <div className="course-price">
              <span className="price-current">{formatPrice(course.price)}</span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="price-original">{formatPrice(course.originalPrice)}</span>
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
        </div>
      </div>
      
      <Footer />

      {/* Image Viewer Modal */}
      {imageViewerOpen && courseDetails.additionalImages && courseDetails.additionalImages.length > 0 && (
        <div 
          className="image-viewer-modal"
          onClick={(e) => {
            if (e.target.className === 'image-viewer-modal') closeImageViewer()
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeImageViewer}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              zIndex: 10001
            }}
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {courseDetails.additionalImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10001
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10001
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '10px',
              zIndex: 10001
            }}
          >
            <button
              onClick={zoomOut}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 15px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <ZoomOut size={16} />
            </button>
            
            <button
              onClick={resetZoom}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 15px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RotateCcw size={16} />
              {Math.round(imageZoom * 100)}%
            </button>
            
            <button
              onClick={zoomIn}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 15px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Image Counter */}
          {courseDetails.additionalImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}
            >
              {currentImageIndex + 1} / {courseDetails.additionalImages.length}
            </div>
          )}

          {/* Main Image */}
          <div
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={courseDetails.additionalImages[currentImageIndex]}
              alt={`Course image ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                transition: 'transform 0.3s ease',
                cursor: imageZoom > 1 ? 'grab' : 'default'
              }}
              draggable={false}
              onMouseDown={(e) => {
                if (imageZoom > 1) {
                  const startX = e.clientX - imagePosition.x
                  const startY = e.clientY - imagePosition.y
                  
                  const handleMouseMove = (e) => {
                    setImagePosition({
                      x: e.clientX - startX,
                      y: e.clientY - startY
                    })
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetail