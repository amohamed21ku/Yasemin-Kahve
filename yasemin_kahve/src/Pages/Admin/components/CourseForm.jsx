import React, { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, Upload, Image as ImageIcon, User, Camera, Globe } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { uploadCourseImage } from '../../../services/courseStorageService'
import { uploadInstructorAvatar } from '../../../services/instructorStorageService'
import './CourseForm.css'

const CourseForm = ({ course, instructors = [], onSubmit, onCancel }) => {
  const { t, language } = useTranslation()
  const [formData, setFormData] = useState({
    image: '',
    title: { en: '', tr: '' },
    category: '',
    courseType: 'On Site',
    level: '',
    duration: '',
    maxStudents: '',
    startDate: '',
    endDate: '',
    price: '',
    originalPrice: '',
    location: { en: '', tr: '' },
    instructorId: '',
    shortDescription: { en: '', tr: '' },
    fullDescription: { en: '', tr: '' },
    prerequisites: { en: '', tr: '' },
    materials: [],
    curriculum: [],
    rating: 4.5,
    isActive: true
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [showCreateInstructor, setShowCreateInstructor] = useState(false)
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    avatar: '',
    title: { en: '', tr: '' }
  })
  const [instructorImageUploading, setInstructorImageUploading] = useState(false)
  const [pendingCourseImage, setPendingCourseImage] = useState(null)
  const [pendingInstructorAvatar, setPendingInstructorAvatar] = useState(null)
  const fileInputRef = useRef(null)
  const instructorFileInputRef = useRef(null)

  useEffect(() => {
    if (course) {
      setFormData({
        image: course.image || '',
        title: course.title || { en: '', tr: '' },
        category: course.category || '',
        courseType: course.courseType || 'On Site',
        level: course.level || '',
        duration: course.duration || '',
        maxStudents: course.maxStudents || '',
        startDate: course.startDate || '',
        endDate: course.endDate || '',
        price: course.price || '',
        originalPrice: course.originalPrice || '',
        location: course.location || { en: '', tr: '' },
        instructorId: course.instructorId || '',
        shortDescription: course.shortDescription || { en: '', tr: '' },
        fullDescription: course.fullDescription || { en: '', tr: '' },
        prerequisites: course.prerequisites || { en: '', tr: '' },
        materials: course.materials || [],
        curriculum: course.curriculum || [],
        rating: course.rating || 4.5,
        isActive: course.isActive !== false
      })
      setPendingCourseImage(null)
      setPendingInstructorAvatar(null)
    } else {
      setPendingCourseImage(null)
      setPendingInstructorAvatar(null)
    }
  }, [course])

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNewInstructorChange = (field, value, lang = null) => {
    if (lang) {
      setNewInstructor(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }))
    } else {
      setNewInstructor(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const createNewInstructor = async () => {
    if (!newInstructor.name.trim() || !newInstructor.title.en.trim() || !newInstructor.title.tr.trim()) {
      alert(t('instructorDetailsRequired') || 'Please fill all instructor details')
      return
    }

    const instructorData = {
      ...newInstructor,
      id: Date.now().toString()
    }

    // Set the new instructor as selected
    handleInputChange('instructorId', instructorData.id)
    
    // Reset form and close modal
    setNewInstructor({
      name: '',
      avatar: '',
      title: { en: '', tr: '' }
    })
    setShowCreateInstructor(false)
    
    // Note: This would need to be handled by parent component in real implementation
    alert(t('instructorCreatedNote') || 'Instructor will be created when you save the course.')
  }

  const handleImageUpload = (event, type = 'course') => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('invalidFileType') || 'Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileTooLarge') || 'File size must be less than 5MB')
      return
    }

    // Store file temporarily and create preview URL
    if (type === 'course') {
      setPendingCourseImage(file)
      const previewUrl = URL.createObjectURL(file)
      handleInputChange('image', previewUrl)
    } else {
      setPendingInstructorAvatar(file)
      const previewUrl = URL.createObjectURL(file)
      handleNewInstructorChange('avatar', previewUrl)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.en || !formData.title.tr) {
      alert(t('titleRequired') || 'Course title is required in both languages')
      return
    }
    
    if (!formData.price || !formData.maxStudents) {
      alert(t('priceAndCapacityRequired') || 'Price and max students are required')
      return
    }

    if (!formData.instructorId) {
      alert(t('instructorRequired') || 'Please select an instructor')
      return
    }

    try {
      setImageUploading(true)

      // Upload course image if there's a pending one
      let finalCourseImage = formData.image
      if (pendingCourseImage) {
        const courseId = course?.id || `course_${Date.now()}`
        const courseTitle = formData.title?.en || ''
        const oldImageUrl = course?.image || null
        finalCourseImage = await uploadCourseImage(courseId, pendingCourseImage, courseTitle, oldImageUrl)
      }

      // Upload instructor avatar if creating a new instructor and there's a pending one
      let finalInstructorAvatar = newInstructor.avatar
      if (pendingInstructorAvatar && newInstructor.name) {
        const instructorId = newInstructor.name.toLowerCase().replace(/\s+/g, '_')
        const instructorName = newInstructor.name
        finalInstructorAvatar = await uploadInstructorAvatar(instructorId, pendingInstructorAvatar, instructorName, null)
      }

      // Prepare course data
      let courseData = {
        ...formData,
        image: finalCourseImage,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        maxStudents: parseInt(formData.maxStudents),
        duration: parseInt(formData.duration)
      }

      // Add new instructor data if needed
      const selectedInstructor = instructors.find(i => i.id === formData.instructorId)
      if (!selectedInstructor && newInstructor.name) {
        courseData.newInstructor = {
          ...newInstructor,
          avatar: finalInstructorAvatar,
          id: formData.instructorId
        }
      }

      onSubmit(courseData)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert(t('uploadError') || 'Error uploading files. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const getLocalizedText = (textObj, fallback = '') => {
    if (textObj && typeof textObj === 'object') {
      return textObj[language] || textObj.en || textObj.tr || fallback
    }
    return textObj || fallback
  }

  return (
    <div className="course-form-container">
      <div className="course-form-header">
        <h1>
          {course 
            ? (t('editCourse') || 'Edit Course')
            : (t('addNewCourse') || 'Add New Course')
          }
        </h1>
        <button 
          className="course-close-btn"
          onClick={onCancel}
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        {/* Image Upload */}
        <div className="course-form-section">
          <h3>{t('courseImage') || 'Course Image'}</h3>
          
          <div className="course-image-upload-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e, 'course')}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {formData.image ? (
              <div className="course-image-preview">
                <img src={formData.image} alt="Course preview" />
                <div className="course-image-overlay">
                  <button
                    type="button"
                    className="course-change-image-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={16} />
                    {t('changeImage') || 'Change Image'}
                  </button>
                  <button
                    type="button"
                    className="course-remove-image-btn"
                    onClick={() => handleInputChange('image', '')}
                  >
                    <X size={16} />
                    {t('removeImage') || 'Remove'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="course-upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                <div className="course-upload-icon">
                  <Upload size={48} />
                </div>
                <p>{t('clickToUploadCourseImage') || 'Click to upload course image'}</p>
                <span>{t('supportedFormats') || 'JPG, PNG, GIF up to 5MB'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Course Information */}
        <div className="course-form-section">
          <h3>{t('courseInformation') || 'Course Information'}</h3>
            
          {/* Course Names */}
          <div className="course-language-inputs">
            <div className="course-language-input">
              <label>
                <Globe size={16} />
                {t('english') || 'English'}
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                placeholder={t('enterTitleEnglish') || 'Enter course title in English'}
                required
              />
            </div>
            
            <div className="course-language-input">
              <label>
                <Globe size={16} />
                {t('turkish') || 'Türkçe'}
              </label>
              <input
                type="text"
                value={formData.title.tr}
                onChange={(e) => handleInputChange('title', e.target.value, 'tr')}
                placeholder={t('enterTitleTurkish') || 'Kurs başlığını Türkçe girin'}
                required
              />
            </div>
          </div>

            {/* Category Dropdown */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('category') || 'Category'}</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">{t('selectCategory') || 'Select Category'}</option>
                  <option value="basics">Basics</option>
                  <option value="brewing">Brewing</option>
                  <option value="tasting">Tasting</option>
                  <option value="roasting">Roasting</option>
                  <option value="business">Business</option>
                  <option value="barista">Barista Skills</option>
                </select>
              </div>
              
              {/* Course Type Dropdown */}
              <div className="form-group">
                <label>{t('courseType') || 'Course Type'}</label>
                <select
                  value={formData.courseType}
                  onChange={(e) => handleInputChange('courseType', e.target.value)}
                >
                  <option value="On Site">{t('onSite') || 'On Site'}</option>
                  <option value="Online">{t('online') || 'Online'}</option>
                </select>
              </div>
            </div>

            {/* Course Level Dropdown */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('courseLevel') || 'Course Level'}</label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <option value="">{t('selectLevel') || 'Select Level'}</option>
                  <option value="Beginner">{t('beginner') || 'Beginner'}</option>
                  <option value="Intermediate">{t('intermediate') || 'Intermediate'}</option>
                  <option value="Advanced">{t('advanced') || 'Advanced'}</option>
                </select>
              </div>
              
              {/* Duration */}
              <div className="form-group">
                <label>{t('duration') || 'Duration (days)'} *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Max Students */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('maxStudents') || 'Max Students'} *</label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Start and End Date */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('startDate') || 'Start Date'}</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>{t('endDate') || 'End Date'}</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {/* Price and Original Price */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('price') || 'Price (TRY)'} *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('originalPrice') || 'Original Price (TRY)'}</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Location */}
            {formData.courseType !== 'Online' && (
              <div className="form-row">
                <div className="form-group">
                  <label>{t('locationEn') || 'Location (English)'}</label>
                  <input
                    type="text"
                    value={formData.location.en}
                    onChange={(e) => handleInputChange('location', e.target.value, 'en')}
                  />
                </div>
                <div className="form-group">
                  <label>{t('locationTr') || 'Location (Turkish)'}</label>
                  <input
                    type="text"
                    value={formData.location.tr}
                    onChange={(e) => handleInputChange('location', e.target.value, 'tr')}
                  />
                </div>
              </div>
            )}
          </div>

        {/* Instructor Selection */}
        <div className="course-form-section">
          <h3>{t('instructorSelection') || 'Instructor Selection'}</h3>
            
            <div className="instructor-selector">
              <div className="form-group">
                <label>{t('selectInstructor') || 'Select Instructor'} *</label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => handleInputChange('instructorId', e.target.value)}
                  required
                >
                  <option value="">{t('chooseInstructor') || 'Choose an instructor...'}</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="instructor-actions">
                <button 
                  type="button" 
                  className="create-instructor-btn"
                  onClick={() => setShowCreateInstructor(true)}
                >
                  <Plus size={16} />
                  {t('createNewInstructor') || 'Create New Instructor'}
                </button>
              </div>
            </div>

            {/* Selected Instructor Preview */}
            {formData.instructorId && (
              <div className="selected-instructor-preview">
                {(() => {
                  const selectedInstructor = instructors.find(i => i.id === formData.instructorId)
                  return selectedInstructor ? (
                    <div className="instructor-card-preview">
                      <div className="instructor-avatar-small">
                        {selectedInstructor.avatar ? (
                          <img src={selectedInstructor.avatar} alt={selectedInstructor.name} />
                        ) : (
                          <div className="avatar-placeholder-small">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="instructor-info-small">
                        <h4>{selectedInstructor.name}</h4>
                        <p>{getLocalizedText(selectedInstructor.title)}</p>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>

        {/* Form Actions */}
        <div className="course-form-actions">
          <button
            type="button"
            className="course-cancel-btn"
            onClick={onCancel}
            disabled={imageUploading}
          >
            {t('cancel') || 'Cancel'}
          </button>
          
          <button
            type="submit"
            className="course-save-btn"
            disabled={imageUploading}
          >
            {imageUploading ? (
              <div className="course-loading-content">
                <div className="course-spinner"></div>
                {t('saving') || 'Saving...'}
              </div>
            ) : (
              <>
                {course 
                  ? (t('updateCourse') || 'Update Course') 
                  : (t('createCourse') || 'Create Course')
                }
              </>
            )}
          </button>
        </div>
      </form>

      {/* Create New Instructor Modal */}
      {showCreateInstructor && (
        <div className="instructor-create-overlay">
          <div className="instructor-create-modal">
            <div className="instructor-create-header">
              <h3>{t('createNewInstructor') || 'Create New Instructor'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateInstructor(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="instructor-create-form">
              <div className="form-group avatar-group">
                <label>{t('avatar') || 'Avatar'}</label>
                <div className="avatar-upload-container">
                  <div className="avatar-preview">
                    {newInstructor.avatar ? (
                      <img src={newInstructor.avatar} alt="Preview" />
                    ) : (
                      <div className="avatar-placeholder">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="avatar-controls">
                    <button 
                      type="button" 
                      className="upload-btn"
                      onClick={() => instructorFileInputRef.current?.click()}
                      disabled={instructorImageUploading}
                    >
                      <Upload size={16} />
                      {instructorImageUploading ? (t('uploading') || 'Uploading...') : (t('selectAvatar') || 'Select Avatar')}
                    </button>
                    {newInstructor.avatar && (
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => handleNewInstructorChange('avatar', '')}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={instructorFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'instructor')}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('instructorName') || 'Instructor Name'} *</label>
                <input
                  type="text"
                  value={newInstructor.name}
                  onChange={(e) => handleNewInstructorChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('titleEn') || 'Title (English)'} *</label>
                  <input
                    type="text"
                    value={newInstructor.title.en}
                    onChange={(e) => handleNewInstructorChange('title', e.target.value, 'en')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('titleTr') || 'Title (Turkish)'} *</label>
                  <input
                    type="text"
                    value={newInstructor.title.tr}
                    onChange={(e) => handleNewInstructorChange('title', e.target.value, 'tr')}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowCreateInstructor(false)}
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button 
                  type="button" 
                  className="submit-btn"
                  onClick={createNewInstructor}
                >
                  {t('createInstructor') || 'Create Instructor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseForm