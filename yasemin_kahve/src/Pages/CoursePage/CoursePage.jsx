import React, { useState, useEffect } from 'react'
import { ArrowLeft, Play, Download, CheckCircle, Clock, Users, Award, FileText, Video, Image, Lock } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { useTranslation } from '../../useTranslation'
import { useAuth } from '../../AuthContext'
import { getCourseById, updateEnrollmentProgress } from '../../services/courseService'
import './CoursePage.css'

const CoursePage = ({ courseId, onNavigate, onBack }) => {
  const { t, language } = useTranslation()
  const { currentUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [progress, setProgress] = useState(0)
  const [activeModule, setActiveModule] = useState(0)

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      const courseData = await getCourseById(courseId)
      setCourse(courseData)
      
      // Initialize with sample course materials for demonstration
      const sampleModules = [
        {
          id: 1,
          title: { en: "Introduction to Coffee", tr: "Kahveye Giriş" },
          duration: 2,
          lessons: [
            { 
              id: 1,
              title: { en: "History of Coffee", tr: "Kahvenin Tarihi" },
              type: 'video',
              duration: 15,
              content: {
                videoUrl: 'sample-video-1.mp4',
                description: { 
                  en: "Learn about the fascinating history of coffee from its origins in Ethiopia to its global journey.",
                  tr: "Kahvenin Etiyopya'daki kökenlerinden küresel yolculuğuna kadar büyüleyici tarihini öğrenin."
                }
              },
              completed: false
            },
            { 
              id: 2,
              title: { en: "Coffee Plant & Bean Types", tr: "Kahve Bitkisi ve Çekirdek Türleri" },
              type: 'reading',
              duration: 10,
              content: {
                text: { 
                  en: "Understanding the different types of coffee plants and beans is fundamental to coffee knowledge...",
                  tr: "Farklı kahve bitki ve çekirdek türlerini anlamak kahve bilgisinin temelidir..."
                }
              },
              completed: false
            },
            { 
              id: 3,
              title: { en: "Global Coffee Regions", tr: "Küresel Kahve Bölgeleri" },
              type: 'interactive',
              duration: 20,
              content: {
                mapData: 'coffee-regions-map.json',
                description: { 
                  en: "Explore coffee growing regions around the world and their unique characteristics.",
                  tr: "Dünya çapındaki kahve yetiştirilen bölgeleri ve benzersiz özelliklerini keşfedin."
                }
              },
              completed: false
            }
          ]
        },
        {
          id: 2,
          title: { en: "Brewing Fundamentals", tr: "Demleme Temelleri" },
          duration: 3,
          lessons: [
            { 
              id: 4,
              title: { en: "Water Quality & Temperature", tr: "Su Kalitesi ve Sıcaklık" },
              type: 'video',
              duration: 18,
              content: {
                videoUrl: 'sample-video-2.mp4',
                description: { 
                  en: "Discover how water quality and temperature affect your coffee brewing.",
                  tr: "Su kalitesi ve sıcaklığının kahve demlemesini nasıl etkilediğini keşfedin."
                }
              },
              completed: false
            },
            { 
              id: 5,
              title: { en: "Grind Size & Extraction", tr: "Öğütme Boyutu ve Ekstraksiyon" },
              type: 'practical',
              duration: 25,
              content: {
                instructions: { 
                  en: "Practice different grind sizes and observe extraction differences...",
                  tr: "Farklı öğütme boyutlarını deneyin ve ekstraksiyon farklılıklarını gözlemleyin..."
                }
              },
              completed: false
            }
          ]
        }
      ]
      
      setCourse(prevCourse => ({ ...prevCourse, modules: sampleModules }))
      
      // Set first lesson as active
      if (sampleModules.length > 0 && sampleModules[0].lessons.length > 0) {
        setActiveLesson(sampleModules[0].lessons[0])
      }
      
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get localized content
  const getLocalizedText = (textObj, fallback = '') => {
    if (textObj && typeof textObj === 'object') {
      return textObj[language] || textObj.en || textObj.tr || fallback
    }
    return textObj || fallback
  }

  const handleLessonClick = (lesson, moduleIndex) => {
    setActiveLesson(lesson)
    setActiveModule(moduleIndex)
  }

  const markLessonComplete = async (lessonId) => {
    if (!completedLessons.has(lessonId)) {
      const newCompleted = new Set([...completedLessons, lessonId])
      setCompletedLessons(newCompleted)
      
      // Calculate progress
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
      const completedCount = newCompleted.size
      const newProgress = Math.round((completedCount / totalLessons) * 100)
      setProgress(newProgress)
      
      // Update in Firebase (placeholder for now)
      try {
        // await updateEnrollmentProgress(enrollmentId, newProgress, lessonId)
        console.log('Progress updated:', newProgress)
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
  }

  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      onNavigate('academy')
    }
  }

  if (loading) {
    return (
      <div className="course-page">
        <Header activeSection="academy" onNavigate={onNavigate} />
        <div className="course-loading">
          <div className="loading-spinner"></div>
          <p>{t('loadingCourse') || 'Loading course...'}</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="course-page">
        <Header activeSection="academy" onNavigate={onNavigate} />
        <div className="course-not-found">
          <h2>{t('courseNotFound') || 'Course not found'}</h2>
          <button onClick={handleBackClick} className="back-btn">
            <ArrowLeft size={20} />
            {t('backToAcademy') || 'Back to Academy'}
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="course-page">
      <Header activeSection="academy" onNavigate={onNavigate} />
      
      <div className="course-page-header">
        <div className="course-header-content">
          <button onClick={handleBackClick} className="back-btn">
            <ArrowLeft size={20} />
            {t('backToAcademy') || 'Back to Academy'}
          </button>
          
          <div className="course-info">
            <h1>{getLocalizedText(course.title)}</h1>
            <div className="course-progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              <span className="progress-text">{progress}% {t('completed') || 'Completed'}</span>
            </div>
          </div>
          
          <div className="course-stats">
            <div className="stat-item">
              <Users size={18} />
              <span>{course.enrolledStudents?.length || 0} {t('students') || 'students'}</span>
            </div>
            <div className="stat-item">
              <Clock size={18} />
              <span>{course.duration || 8} {t('hours') || 'hours'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="course-page-body">
        <div className="course-sidebar">
          <div className="course-modules">
            <h3>{t('courseContent') || 'Course Content'}</h3>
            
            {course.modules?.map((module, moduleIndex) => (
              <div key={module.id} className={`module-section ${moduleIndex === activeModule ? 'active' : ''}`}>
                <div className="module-header" onClick={() => setActiveModule(moduleIndex)}>
                  <h4>{getLocalizedText(module.title)}</h4>
                  <span className="module-duration">{module.duration}h</span>
                </div>
                
                <div className="module-lessons">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className={`lesson-item ${activeLesson?.id === lesson.id ? 'active' : ''} ${completedLessons.has(lesson.id) ? 'completed' : ''}`}
                      onClick={() => handleLessonClick(lesson, moduleIndex)}
                    >
                      <div className="lesson-type-icon">
                        {lesson.type === 'video' && <Video size={16} />}
                        {lesson.type === 'reading' && <FileText size={16} />}
                        {lesson.type === 'interactive' && <Play size={16} />}
                        {lesson.type === 'practical' && <Award size={16} />}
                      </div>
                      
                      <div className="lesson-content">
                        <span className="lesson-title">{getLocalizedText(lesson.title)}</span>
                        <span className="lesson-duration">{lesson.duration} min</span>
                      </div>
                      
                      {completedLessons.has(lesson.id) && (
                        <CheckCircle size={16} className="lesson-completed-icon" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="course-resources">
            <h3>{t('resources') || 'Resources'}</h3>
            <div className="resource-list">
              <div className="resource-item">
                <Download size={16} />
                <span>{t('courseHandbook') || 'Course Handbook'}</span>
              </div>
              <div className="resource-item">
                <Image size={16} />
                <span>{t('coffeeCharts') || 'Coffee Charts'}</span>
              </div>
              <div className="resource-item">
                <FileText size={16} />
                <span>{t('tastingNotes') || 'Tasting Notes'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="course-main-content">
          {activeLesson ? (
            <div className="lesson-content-area">
              <div className="lesson-header">
                <h2>{getLocalizedText(activeLesson.title)}</h2>
                <div className="lesson-meta">
                  <span className="lesson-duration">
                    <Clock size={16} />
                    {activeLesson.duration} {t('minutes') || 'minutes'}
                  </span>
                  <span className={`lesson-type type-${activeLesson.type}`}>
                    {activeLesson.type}
                  </span>
                </div>
              </div>
              
              <div className="lesson-body">
                {activeLesson.type === 'video' && (
                  <div className="video-content">
                    <div className="video-placeholder">
                      <Play size={48} />
                      <p>{t('videoContent') || 'Video content will be displayed here'}</p>
                      <small>{getLocalizedText(activeLesson.content.description)}</small>
                    </div>
                  </div>
                )}
                
                {activeLesson.type === 'reading' && (
                  <div className="reading-content">
                    <div className="text-content">
                      <p>{getLocalizedText(activeLesson.content.text)}</p>
                      <p>{t('readingContentDemo') || 'This is a demonstration of reading content. In a real implementation, this would contain the full lesson text, images, and interactive elements.'}</p>
                    </div>
                  </div>
                )}
                
                {activeLesson.type === 'interactive' && (
                  <div className="interactive-content">
                    <div className="interactive-placeholder">
                      <Award size={48} />
                      <p>{t('interactiveContent') || 'Interactive content will be displayed here'}</p>
                      <small>{getLocalizedText(activeLesson.content.description)}</small>
                    </div>
                  </div>
                )}
                
                {activeLesson.type === 'practical' && (
                  <div className="practical-content">
                    <div className="instructions">
                      <h3>{t('practicalInstructions') || 'Practical Instructions'}</h3>
                      <p>{getLocalizedText(activeLesson.content.instructions)}</p>
                      <div className="practice-checklist">
                        <p>{t('practicalDemo') || 'In a real implementation, this would contain:'}</p>
                        <ul>
                          <li>{t('stepByStepInstructions') || 'Step-by-step instructions'}</li>
                          <li>{t('requiredEquipment') || 'Required equipment list'}</li>
                          <li>{t('safetyGuidelines') || 'Safety guidelines'}</li>
                          <li>{t('submissionForm') || 'Practice submission form'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lesson-actions">
                {!completedLessons.has(activeLesson.id) && (
                  <button 
                    className="complete-lesson-btn"
                    onClick={() => markLessonComplete(activeLesson.id)}
                  >
                    <CheckCircle size={20} />
                    {t('markComplete') || 'Mark as Complete'}
                  </button>
                )}
                
                {completedLessons.has(activeLesson.id) && (
                  <div className="lesson-completed">
                    <CheckCircle size={20} />
                    <span>{t('lessonCompleted') || 'Lesson Completed'}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-lesson-selected">
              <Play size={64} />
              <h3>{t('selectLesson') || 'Select a lesson to get started'}</h3>
              <p>{t('selectLessonDesc') || 'Choose a lesson from the sidebar to begin your learning journey.'}</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CoursePage