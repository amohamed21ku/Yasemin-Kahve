import React, { useState, useRef } from 'react'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  FileText, 
  Video, 
  Image as ImageIcon,
  User
} from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { updateCourse } from '../../../services/courseService'
import { uploadAdditionalImage, uploadCourseVideo, uploadCourseDocument, deleteSpecificCourseFile } from '../../../services/courseStorageService'
import './AdminCourseDetail.css'

const AdminCourseDetail = ({ course, instructors = [], onBack, onUpdate }) => {
  const { t, language } = useTranslation()
  const [isEditing, setIsEditing] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [courseData, setCourseData] = useState({
    ...course,
    instructorId: course.instructorId || course.instructor?.id || '',
    curriculum: course.curriculum || [],
    videos: course.videos || [],
    additionalImages: course.additionalImages || [],
    documents: course.documents || []
  })
  const [uploading, setUploading] = useState(false)
  
  const videoFileRef = useRef(null)
  const imageFileRef = useRef(null)
  const docFileRef = useRef(null)

  const getLocalizedText = (textObj, fallback = '') => {
    if (textObj && typeof textObj === 'object') {
      return textObj[language] || textObj.en || textObj.tr || fallback
    }
    return textObj || fallback
  }

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setCourseData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }))
    } else {
      setCourseData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    try {
      // Ensure all media arrays are included in the save data
      const saveData = {
        ...courseData,
        videos: courseData.videos || [],
        additionalImages: courseData.additionalImages || [],
        documents: courseData.documents || []
      }
      
      await updateCourse(course.id, saveData)
      onUpdate()
      alert(t('courseUpdatedSuccess') || 'Course updated successfully!')
    } catch (error) {
      console.error('Error updating course:', error)
      alert(t('courseUpdateError') || 'Error updating course. Please try again.')
    }
  }

  const handleFileUpload = async (file, type) => {
    try {
      setUploading(true)
      
      // File size validation
      const maxSizes = {
        video: 100 * 1024 * 1024, // 100MB
        image: 5 * 1024 * 1024,   // 5MB
        document: 10 * 1024 * 1024 // 10MB
      }
      
      if (file.size > maxSizes[type]) {
        const sizeMB = (maxSizes[type] / (1024 * 1024)).toFixed(0)
        alert(t('fileTooLarge') || `File is too large. Maximum size for ${type} is ${sizeMB}MB.`)
        return
      }
      
      // File type validation
      const allowedTypes = {
        video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
        image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      }
      
      if (!allowedTypes[type].includes(file.type)) {
        alert(t('invalidFileType') || `Invalid file type. Please select a valid ${type} file.`)
        return
      }
      
      let downloadURL
      
      const courseTitle = courseData.title?.en || ''
      
      switch (type) {
        case 'video':
          downloadURL = await uploadCourseVideo(course.id, file, courseTitle)
          const updatedVideoData = {
            ...courseData,
            videos: [...(courseData.videos || []), { url: downloadURL, name: file.name }]
          }
          setCourseData(updatedVideoData)
          // Save to database immediately
          await updateCourse(course.id, updatedVideoData)
          alert(t('videoUploadSuccess') || 'Video uploaded successfully!')
          break
        case 'image':
          downloadURL = await uploadAdditionalImage(course.id, file, courseTitle)
          const updatedImageData = {
            ...courseData,
            additionalImages: [...(courseData.additionalImages || []), downloadURL]
          }
          setCourseData(updatedImageData)
          // Save to database immediately
          await updateCourse(course.id, updatedImageData)
          alert(t('imageUploadSuccess') || 'Image uploaded successfully!')
          break
        case 'document':
          downloadURL = await uploadCourseDocument(course.id, file, courseTitle)
          const updatedDocumentData = {
            ...courseData,
            documents: [...(courseData.documents || []), { url: downloadURL, name: file.name }]
          }
          setCourseData(updatedDocumentData)
          // Save to database immediately
          await updateCourse(course.id, updatedDocumentData)
          alert(t('documentUploadSuccess') || 'Document uploaded successfully!')
          break
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      let errorMessage = t('uploadError') || `Error uploading ${type}. Please try again.`
      
      if (error.code === 'storage/canceled') {
        errorMessage = t('uploadCanceled') || 'Upload was canceled.'
      } else if (error.code === 'storage/unauthorized') {
        errorMessage = t('uploadUnauthorized') || 'You are not authorized to upload files.'
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage = t('uploadTimeout') || 'Upload timed out. Please try with a smaller file.'
      }
      
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const addCurriculumModule = () => {
    const module = {
      id: Date.now(),
      title: { en: '', tr: '' },
      duration: 1,
      lessons: []
    }
    
    setCourseData(prev => ({
      ...prev,
      curriculum: [...(prev.curriculum || []), module]
    }))
  }

  const updateCurriculumModule = (moduleId, field, value, lang = null) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum?.map(module =>
        module.id === moduleId
          ? lang
            ? { ...module, [field]: { ...module[field], [lang]: value } }
            : { ...module, [field]: value }
          : module
      ) || []
    }))
  }

  const removeCurriculumModule = (moduleId) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum?.filter(m => m.id !== moduleId) || []
    }))
  }

  const addLesson = (moduleId) => {
    const lesson = { en: '', tr: '' }
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum?.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...(module.lessons || []), lesson] }
          : module
      ) || []
    }))
  }

  const updateLesson = (moduleId, lessonIndex, value, lang) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum?.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons?.map((lesson, index) =>
                index === lessonIndex
                  ? { ...lesson, [lang]: value }
                  : lesson
              ) || []
            }
          : module
      ) || []
    }))
  }

  const removeLesson = (moduleId, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum?.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons?.filter((_, index) => index !== lessonIndex) || []
            }
          : module
      ) || []
    }))
  }

  const handleInstructorSelection = (instructorId) => {
    setCourseData(prev => ({
      ...prev,
      instructorId: instructorId
    }))
  }

  const addOverviewSection = () => {
    const section = {
      id: Date.now(),
      subtitle: { en: '', tr: '' },
      content: { en: '', tr: '' }
    }
    
    setCourseData(prev => ({
      ...prev,
      overviewSections: [...(prev.overviewSections || []), section]
    }))
  }

  const updateOverviewSection = (sectionId, field, value, lang) => {
    setCourseData(prev => ({
      ...prev,
      overviewSections: prev.overviewSections?.map(section =>
        section.id === sectionId
          ? { ...section, [field]: { ...section[field], [lang]: value } }
          : section
      ) || []
    }))
  }

  const removeOverviewSection = (sectionId) => {
    setCourseData(prev => ({
      ...prev,
      overviewSections: prev.overviewSections?.filter(s => s.id !== sectionId) || []
    }))
  }

  const removeVideo = async (videoIndex) => {
    try {
      const videoToRemove = courseData.videos[videoIndex]
      if (videoToRemove && videoToRemove.url) {
        await deleteSpecificCourseFile(videoToRemove.url)
      }
      
      const updatedData = {
        ...courseData,
        videos: courseData.videos?.filter((_, index) => index !== videoIndex) || []
      }
      setCourseData(updatedData)
      // Save to database immediately
      await updateCourse(course.id, updatedData)
      
      alert(t('videoDeletedSuccess') || 'Video deleted successfully!')
    } catch (error) {
      console.error('Error deleting video:', error)
      alert(t('videoDeleteError') || 'Error deleting video. Please try again.')
    }
  }

  const removeImage = async (imageIndex) => {
    try {
      const imageToRemove = courseData.additionalImages[imageIndex]
      if (imageToRemove) {
        await deleteSpecificCourseFile(imageToRemove)
      }
      
      const updatedData = {
        ...courseData,
        additionalImages: courseData.additionalImages?.filter((_, index) => index !== imageIndex) || []
      }
      setCourseData(updatedData)
      // Save to database immediately
      await updateCourse(course.id, updatedData)
      
      alert(t('imageDeletedSuccess') || 'Image deleted successfully!')
    } catch (error) {
      console.error('Error deleting image:', error)
      alert(t('imageDeleteError') || 'Error deleting image. Please try again.')
    }
  }

  const removeDocument = async (docIndex) => {
    try {
      const docToRemove = courseData.documents[docIndex]
      if (docToRemove && docToRemove.url) {
        await deleteSpecificCourseFile(docToRemove.url)
      }
      
      const updatedData = {
        ...courseData,
        documents: courseData.documents?.filter((_, index) => index !== docIndex) || []
      }
      setCourseData(updatedData)
      // Save to database immediately
      await updateCourse(course.id, updatedData)
      
      alert(t('documentDeletedSuccess') || 'Document deleted successfully!')
    } catch (error) {
      console.error('Error deleting document:', error)
      alert(t('documentDeleteError') || 'Error deleting document. Please try again.')
    }
  }

  const tabs = [
    { id: 'overview', label: t('overview') || 'Overview' },
    { id: 'curriculum', label: t('curriculum') || 'Curriculum' },
    { id: 'instructor', label: t('instructor') || 'Instructor' },
    { id: 'media', label: t('media') || 'Media' },
  ]

  return (
    <div className="admin-course-detail">
      <div className="admin-course-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
            {t('backToCourses') || 'Back to Courses'}
          </button>
          <h1>{getLocalizedText(courseData.title)}</h1>
        </div>
        <div className="header-actions">
          <button onClick={handleSave} className="save-btn">
            <Save size={18} />
            {t('save') || 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="course-detail-tabs">
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

      <div className="course-detail-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="course-basic-info">
              <div className="info-row">
                <label>{t('courseType') || 'Course Type'}:</label>
                {isEditing ? (
                  <select
                    value={courseData.courseType}
                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                  >
                    <option value="On Site">{t('onSite') || 'On Site'}</option>
                    <option value="Online">{t('online') || 'Online'}</option>
                  </select>
                ) : (
                  <span>{courseData.courseType}</span>
                )}
              </div>

              <div className="info-row">
                <label>{t('duration') || 'Duration'}:</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    min="1"
                  />
                ) : (
                  <span>{courseData.duration} {t('days') || 'days'}</span>
                )}
              </div>

              <div className="info-row">
                <label>{t('courseLevel') || 'Course Level'}:</label>
                {isEditing ? (
                  <select
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <option value="Beginner">{t('beginner') || 'Beginner'}</option>
                    <option value="Intermediate">{t('intermediate') || 'Intermediate'}</option>
                    <option value="Advanced">{t('advanced') || 'Advanced'}</option>
                  </select>
                ) : (
                  <span>{courseData.level}</span>
                )}
              </div>

              <div className="info-row">
                <label>{t('price') || 'Price'}:</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <span>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(courseData.price)}</span>
                )}
              </div>
            </div>

            <div className="description-section">
              <h3>{t('courseDescription') || 'Course Description'}</h3>
              {isEditing ? (
                <>
                  <div className="lang-input">
                    <label>{t('mainDescriptionEn') || 'Main Description (English)'}:</label>
                    <textarea
                      value={courseData.fullDescription?.en || ''}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value, 'en')}
                      rows="4"
                      placeholder="Enter main course description in English..."
                    />
                  </div>
                  <div className="lang-input">
                    <label>{t('mainDescriptionTr') || 'Main Description (Turkish)'}:</label>
                    <textarea
                      value={courseData.fullDescription?.tr || ''}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value, 'tr')}
                      rows="4"
                      placeholder="Enter main course description in Turkish..."
                    />
                  </div>
                </>
              ) : (
                <div className="description-display">
                  <p>{getLocalizedText(courseData.fullDescription) || 'No description available'}</p>
                </div>
              )}
            </div>

            <div className="overview-sections">
              <div className="section-header">
                <h3>{t('additionalSections') || 'Additional Overview Sections'}</h3>
                {isEditing && (
                  <button onClick={addOverviewSection} className="add-section-btn">
                    <Plus size={16} />
                    {t('addSection') || 'Add Section'}
                  </button>
                )}
              </div>

              {courseData.overviewSections && courseData.overviewSections.length > 0 ? (
                <div className="sections-list">
                  {courseData.overviewSections.map((section) => (
                    <div key={section.id} className="overview-section-card">
                      {isEditing ? (
                        <>
                          <div className="section-inputs">
                            <div className="subtitle-inputs">
                              <input
                                type="text"
                                placeholder="Subtitle (English)"
                                value={section.subtitle?.en || ''}
                                onChange={(e) => updateOverviewSection(section.id, 'subtitle', e.target.value, 'en')}
                                className="subtitle-input"
                              />
                              <input
                                type="text"
                                placeholder="Subtitle (Turkish)"
                                value={section.subtitle?.tr || ''}
                                onChange={(e) => updateOverviewSection(section.id, 'subtitle', e.target.value, 'tr')}
                                className="subtitle-input"
                              />
                            </div>
                            <div className="content-inputs">
                              <textarea
                                placeholder="Content (English)"
                                value={section.content?.en || ''}
                                onChange={(e) => updateOverviewSection(section.id, 'content', e.target.value, 'en')}
                                rows="3"
                              />
                              <textarea
                                placeholder="Content (Turkish)"
                                value={section.content?.tr || ''}
                                onChange={(e) => updateOverviewSection(section.id, 'content', e.target.value, 'tr')}
                                rows="3"
                              />
                            </div>
                            <button
                              onClick={() => removeOverviewSection(section.id)}
                              className="remove-section-btn"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="section-display">
                          {getLocalizedText(section.subtitle) && (
                            <h4>{getLocalizedText(section.subtitle)}</h4>
                          )}
                          {getLocalizedText(section.content) && (
                            <p>{getLocalizedText(section.content)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                isEditing && <p className="no-sections">No additional sections yet. Click "Add Section" to get started.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="curriculum-section">
            <div className="curriculum-header">
              <h3>{t('courseCurriculum') || 'Course Curriculum'}</h3>
              <button onClick={addCurriculumModule} className="add-module-btn">
                <Plus size={16} />
                {t('addModule') || 'Add Module'}
              </button>
            </div>

            {courseData.curriculum && courseData.curriculum.length > 0 ? (
              <div className="curriculum-modules">
                {courseData.curriculum.map((module, moduleIndex) => (
                  <div key={module.id} className="curriculum-module-card">
                    <div className="module-header">
                      <div className="module-number">{moduleIndex + 1}</div>
                      <div className="module-inputs">
                        <div className="module-title-inputs">
                          <input
                            type="text"
                            placeholder="Module Title (English)"
                            value={module.title?.en || ''}
                            onChange={(e) => updateCurriculumModule(module.id, 'title', e.target.value, 'en')}
                            className="module-title-input"
                          />
                          <input
                            type="text"
                            placeholder="Module Title (Turkish)"
                            value={module.title?.tr || ''}
                            onChange={(e) => updateCurriculumModule(module.id, 'title', e.target.value, 'tr')}
                            className="module-title-input"
                          />
                        </div>
                        <div className="module-duration-input">
                          <label>{t('durationDays') || 'Duration (days)'}:</label>
                          <input
                            type="number"
                            value={module.duration || 1}
                            onChange={(e) => updateCurriculumModule(module.id, 'duration', parseInt(e.target.value))}
                            min="1"
                            className="duration-input"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeCurriculumModule(module.id)}
                        className="remove-module-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="module-lessons">
                      <div className="topics-header">
                        <h4>{t('topics') || 'Topics Covered'}</h4>
                        <button
                          onClick={() => addLesson(module.id)}
                          className="add-topic-btn"
                        >
                          <Plus size={14} />
                          {t('addTopic') || 'Add Topic'}
                        </button>
                      </div>

                      {module.lessons && module.lessons.length > 0 ? (
                        <div className="topics-list">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="topic-item">
                              <div className="topic-number">{lessonIndex + 1}</div>
                              <div className="topic-inputs">
                                <input
                                  type="text"
                                  placeholder="Topic/Learning Objective (English)"
                                  value={lesson?.en || ''}
                                  onChange={(e) => updateLesson(module.id, lessonIndex, e.target.value, 'en')}
                                  className="topic-input"
                                />
                                <input
                                  type="text"
                                  placeholder="Topic/Learning Objective (Turkish)"
                                  value={lesson?.tr || ''}
                                  onChange={(e) => updateLesson(module.id, lessonIndex, e.target.value, 'tr')}
                                  className="topic-input"
                                />
                              </div>
                              <button
                                onClick={() => removeLesson(module.id, lessonIndex)}
                                className="remove-topic-btn"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-topics">{t('noTopicsYet') || 'No topics added yet. Click "Add Topic" to get started.'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-curriculum">
                <p>{t('noCurriculumYet') || 'No curriculum modules yet. Click "Add Module" to get started.'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="instructor-section">
            <h3>{t('courseInstructor') || 'Course Instructor'}</h3>
            
            <div className="instructor-selection">
              <div className="form-group">
                <label>{t('selectInstructor') || 'Select Instructor'}:</label>
                <select
                  value={courseData.instructorId}
                  onChange={(e) => handleInstructorSelection(e.target.value)}
                  className="instructor-select"
                >
                  <option value="">{t('chooseInstructor') || 'Choose an instructor...'}</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>

              {courseData.instructorId && (
                <div className="selected-instructor-preview">
                  {(() => {
                    const selectedInstructor = instructors.find(i => i.id === courseData.instructorId)
                    return selectedInstructor ? (
                      <div className="instructor-card">
                        <div className="instructor-avatar">
                          {selectedInstructor.avatar ? (
                            <img 
                              src={selectedInstructor.avatar} 
                              alt={selectedInstructor.name}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23D2691E'/%3E%3Ccircle cx='60' cy='45' r='18' fill='white'/%3E%3Cpath d='M24 96c0-19.882 16.118-36 36-36s36 16.118 36 36' fill='white'/%3E%3C/svg%3E"
                              }}
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              <User size={40} />
                            </div>
                          )}
                        </div>
                        <div className="instructor-info">
                          <h3>{selectedInstructor.name}</h3>
                          <p className="instructor-title">{getLocalizedText(selectedInstructor.title)}</p>
                          {selectedInstructor.bio && (
                            <p className="instructor-bio">{getLocalizedText(selectedInstructor.bio)}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="no-instructor-selected">{t('noInstructorSelected') || 'No instructor selected'}</p>
                    )
                  })()}
                </div>
              )}

              <div className="instructor-note">
                <p>
                  <strong>{t('note') || 'Note'}:</strong> {t('instructorEditNote') || 'To edit instructor details, use the Instructor Management section.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="content-section">
            <div className="content-upload-section">
              <h3>{t('courseContent') || 'Course Content'}</h3>
              
              <div className="upload-buttons">
                <button
                  onClick={() => videoFileRef.current?.click()}
                  className="upload-btn"
                  disabled={uploading}
                >
                  <Video size={16} />
                  {uploading ? (t('uploading') || 'Uploading...') : (t('addVideo') || 'Add Video')}
                </button>
                
                <button
                  onClick={() => imageFileRef.current?.click()}
                  className="upload-btn"
                  disabled={uploading}
                >
                  <ImageIcon size={16} />
                  {uploading ? (t('uploading') || 'Uploading...') : (t('addImage') || 'Add Image')}
                </button>
                
                <button
                  onClick={() => docFileRef.current?.click()}
                  className="upload-btn"
                  disabled={uploading}
                >
                  <FileText size={16} />
                  {uploading ? (t('uploading') || 'Uploading...') : (t('addDocument') || 'Add Document')}
                </button>
              </div>
              
              {uploading && (
                <div className="upload-progress">
                  <div className="progress-spinner"></div>
                  <span>{t('uploadingFile') || 'Uploading file, please wait...'}</span>
                </div>
              )}

              <input
                ref={videoFileRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/avi,video/mov"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'video')}
              />
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'image')}
              />
              <input
                ref={docFileRef}
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'document')}
              />
            </div>

            <div className="content-lists">
              <div className="content-list">
                <h4>{t('videos') || 'Videos'}</h4>
                {courseData.videos?.length > 0 ? (
                  <ul>
                    {courseData.videos.map((video, index) => (
                      <li key={index}>
                        <Video size={16} />
                        <span>{video.name}</span>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          {t('view') || 'View'}
                        </a>
                        <button
                          onClick={() => removeVideo(index)}
                          className="delete-file-btn"
                          title={t('deleteVideo') || 'Delete Video'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('noVideos') || 'No videos uploaded yet'}</p>
                )}
              </div>

              <div className="content-list">
                <h4>{t('additionalImages') || 'Additional Images'}</h4>
                {courseData.additionalImages?.length > 0 ? (
                  <div className="image-grid">
                    {courseData.additionalImages.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Course image ${index + 1}`} />
                        <button
                          onClick={() => removeImage(index)}
                          className="delete-image-btn"
                          title={t('deleteImage') || 'Delete Image'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{t('noImages') || 'No additional images uploaded yet'}</p>
                )}
              </div>

              <div className="content-list">
                <h4>{t('documents') || 'Documents'}</h4>
                {courseData.documents?.length > 0 ? (
                  <ul>
                    {courseData.documents.map((doc, index) => (
                      <li key={index}>
                        <FileText size={16} />
                        <span>{doc.name}</span>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          {t('download') || 'Download'}
                        </a>
                        <button
                          onClick={() => removeDocument(index)}
                          className="delete-file-btn"
                          title={t('deleteDocument') || 'Delete Document'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t('noDocuments') || 'No documents uploaded yet'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="announcements-header">
              <h3>{t('courseAnnouncements') || 'Course Announcements'}</h3>
              <button onClick={addAnnouncement} className="add-announcement-btn">
                <Plus size={16} />
                {t('addAnnouncement') || 'Add Announcement'}
              </button>
            </div>

            <div className="announcements-list">
              {courseData.announcements?.length > 0 ? (
                courseData.announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <input
                        type="text"
                        placeholder={t('announcementTitleEn') || 'Announcement Title (English)'}
                        value={announcement.title.en}
                        onChange={(e) => updateAnnouncement(announcement.id, 'title', e.target.value, 'en')}
                        className="announcement-title-input"
                      />
                      <input
                        type="text"
                        placeholder={t('announcementTitleTr') || 'Announcement Title (Turkish)'}
                        value={announcement.title.tr}
                        onChange={(e) => updateAnnouncement(announcement.id, 'title', e.target.value, 'tr')}
                        className="announcement-title-input"
                      />
                      <div className="announcement-actions">
                        <label>
                          <input
                            type="checkbox"
                            checked={announcement.isImportant}
                            onChange={(e) => updateAnnouncement(announcement.id, 'isImportant', e.target.checked)}
                          />
                          {t('important') || 'Important'}
                        </label>
                        <button
                          onClick={() => removeAnnouncement(announcement.id)}
                          className="remove-announcement-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="announcement-content">
                      <textarea
                        placeholder={t('announcementContentEn') || 'Announcement Content (English)'}
                        value={announcement.content.en}
                        onChange={(e) => updateAnnouncement(announcement.id, 'content', e.target.value, 'en')}
                        rows="3"
                      />
                      <textarea
                        placeholder={t('announcementContentTr') || 'Announcement Content (Turkish)'}
                        value={announcement.content.tr}
                        onChange={(e) => updateAnnouncement(announcement.id, 'content', e.target.value, 'tr')}
                        rows="3"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>{t('noAnnouncements') || 'No announcements yet'}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCourseDetail