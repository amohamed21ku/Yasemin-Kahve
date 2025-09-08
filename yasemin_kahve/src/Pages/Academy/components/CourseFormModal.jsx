import React, { useState, useRef } from 'react'
import { 
  X, 
  Plus, 
  Upload, 
  Camera, 
  Globe, 
  User, 
  Calendar,
  MapPin,
  Monitor,
  BookOpen,
  DollarSign,
  Clock,
  Users,
  Star
} from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import './CourseFormModal.css'

const CourseFormModal = ({ isOpen, onClose, onSubmit }) => {
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
    instructor: {
      name: '',
      avatar: '',
      title: { en: '', tr: '' },
      email: '',
      bio: { en: '', tr: '' }
    },
    shortDescription: { en: '', tr: '' },
    fullDescription: { en: '', tr: '' },
    prerequisites: { en: '', tr: '' },
    materials: [],
    curriculum: [],
    rating: 4.5,
    isActive: true
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [imageUploading, setImageUploading] = useState(false)
  const [instructorImageUploading, setInstructorImageUploading] = useState(false)
  const fileInputRef = useRef(null)
  const instructorFileInputRef = useRef(null)

  if (!isOpen) return null

  const steps = [
    { id: 1, title: t('basicInfo') || 'Basic Info', icon: BookOpen },
    { id: 2, title: t('details') || 'Details', icon: Star },
    { id: 3, title: t('instructor') || 'Instructor', icon: User },
    { id: 4, title: t('schedule') || 'Schedule', icon: Calendar }
  ]

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

  const handleInstructorChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [field]: {
            ...prev.instructor[field],
            [lang]: value
          }
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [field]: value
        }
      }))
    }
  }

  const handleImageUpload = async (event, type = 'course') => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(t('invalidFileType') || 'Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('fileTooLarge') || 'File size must be less than 5MB')
      return
    }

    try {
      if (type === 'course') {
        setImageUploading(true)
      } else {
        setInstructorImageUploading(true)
      }

      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file)
      
      if (type === 'course') {
        handleInputChange('image', imageUrl)
      } else {
        handleInstructorChange('avatar', imageUrl)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(t('imageUploadError') || 'Error uploading image. Please try again.')
    } finally {
      if (type === 'course') {
        setImageUploading(false)
      } else {
        setInstructorImageUploading(false)
      }
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
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

    if (!formData.instructor.name) {
      alert(t('instructorNameRequired') || 'Instructor name is required')
      return
    }

    const courseData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      maxStudents: parseInt(formData.maxStudents),
      duration: parseInt(formData.duration)
    }

    onSubmit(courseData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="course-step-content">
            <h3 className="step-title">
              <BookOpen size={20} />
              {t('basicInformation') || 'Basic Information'}
            </h3>
            
            {/* Course Image */}
            <div className="form-section">
              <label className="section-label">
                <Camera size={16} />
                {t('courseImage') || 'Course Image'}
              </label>
              
              <div className="image-upload-area">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e, 'course')}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                {formData.image ? (
                  <div className="image-preview">
                    <img src={formData.image} alt="Course preview" />
                    <div className="image-overlay">
                      <button
                        type="button"
                        className="change-image-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={16} />
                        {t('changeImage') || 'Change'}
                      </button>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleInputChange('image', '')}
                      >
                        <X size={16} />
                        {t('remove') || 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                    <div className="upload-icon">
                      <Upload size={48} />
                    </div>
                    <p>{t('clickToUpload') || 'Click to upload image'}</p>
                    <span>{t('supportedFormats') || 'JPG, PNG, GIF up to 5MB'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course Titles */}
            <div className="form-section">
              <label className="section-label">
                <Globe size={16} />
                {t('courseTitles') || 'Course Titles'}
              </label>
              
              <div className="language-inputs">
                <div className="language-input">
                  <label>{t('english') || 'English'}</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    placeholder={t('enterTitleEnglish') || 'Enter course title in English'}
                    required
                  />
                </div>
                
                <div className="language-input">
                  <label>{t('turkish') || 'Türkçe'}</label>
                  <input
                    type="text"
                    value={formData.title.tr}
                    onChange={(e) => handleInputChange('title', e.target.value, 'tr')}
                    placeholder={t('enterTitleTurkish') || 'Kurs başlığını Türkçe girin'}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category and Type */}
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
              
              <div className="form-group">
                <label>{t('courseType') || 'Course Type'}</label>
                <select
                  value={formData.courseType}
                  onChange={(e) => handleInputChange('courseType', e.target.value)}
                >
                  <option value="On Site">
                    <MapPin size={14} /> {t('onSite') || 'On Site'}
                  </option>
                  <option value="Online">
                    <Monitor size={14} /> {t('online') || 'Online'}
                  </option>
                </select>
              </div>
            </div>

            {/* Level and Duration */}
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
              
              <div className="form-group">
                <label>
                  <Clock size={16} />
                  {t('duration') || 'Duration (days)'}
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="course-step-content">
            <h3 className="step-title">
              <Star size={20} />
              {t('courseDetails') || 'Course Details'}
            </h3>

            {/* Pricing */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  <DollarSign size={16} />
                  {t('price') || 'Price (TRY)'}
                </label>
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

            {/* Max Students */}
            <div className="form-group">
              <label>
                <Users size={16} />
                {t('maxStudents') || 'Max Students'}
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                min="1"
                required
              />
            </div>

            {/* Location (if On Site) */}
            {formData.courseType !== 'Online' && (
              <div className="form-section">
                <label className="section-label">
                  <MapPin size={16} />
                  {t('location') || 'Location'}
                </label>
                
                <div className="language-inputs">
                  <div className="language-input">
                    <label>{t('english') || 'English'}</label>
                    <input
                      type="text"
                      value={formData.location.en}
                      onChange={(e) => handleInputChange('location', e.target.value, 'en')}
                      placeholder={t('enterLocationEnglish') || 'Enter location in English'}
                    />
                  </div>
                  
                  <div className="language-input">
                    <label>{t('turkish') || 'Türkçe'}</label>
                    <input
                      type="text"
                      value={formData.location.tr}
                      onChange={(e) => handleInputChange('location', e.target.value, 'tr')}
                      placeholder={t('enterLocationTurkish') || 'Konumu Türkçe girin'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Descriptions */}
            <div className="form-section">
              <label className="section-label">
                {t('shortDescription') || 'Short Description'}
              </label>
              
              <div className="language-inputs">
                <div className="language-input">
                  <label>{t('english') || 'English'}</label>
                  <textarea
                    value={formData.shortDescription.en}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value, 'en')}
                    placeholder={t('enterShortDescEnglish') || 'Enter short description in English'}
                    rows={3}
                  />
                </div>
                
                <div className="language-input">
                  <label>{t('turkish') || 'Türkçe'}</label>
                  <textarea
                    value={formData.shortDescription.tr}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value, 'tr')}
                    placeholder={t('enterShortDescTurkish') || 'Kısa açıklamayı Türkçe girin'}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="course-step-content">
            <h3 className="step-title">
              <User size={20} />
              {t('instructorInfo') || 'Instructor Information'}
            </h3>

            {/* Instructor Avatar */}
            <div className="form-section">
              <label className="section-label">
                <Camera size={16} />
                {t('instructorAvatar') || 'Instructor Avatar'}
              </label>
              
              <div className="avatar-upload-section">
                <input
                  type="file"
                  ref={instructorFileInputRef}
                  onChange={(e) => handleImageUpload(e, 'instructor')}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <div className="avatar-preview">
                  {formData.instructor.avatar ? (
                    <img src={formData.instructor.avatar} alt="Instructor" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={40} />
                    </div>
                  )}
                </div>
                
                <div className="avatar-controls">
                  <button
                    type="button"
                    className="upload-avatar-btn"
                    onClick={() => instructorFileInputRef.current?.click()}
                    disabled={instructorImageUploading}
                  >
                    <Upload size={16} />
                    {instructorImageUploading ? (t('uploading') || 'Uploading...') : (t('selectAvatar') || 'Select Avatar')}
                  </button>
                  
                  {formData.instructor.avatar && (
                    <button
                      type="button"
                      className="remove-avatar-btn"
                      onClick={() => handleInstructorChange('avatar', '')}
                    >
                      <X size={16} />
                      {t('remove') || 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Instructor Name and Email */}
            <div className="form-row">
              <div className="form-group">
                <label>{t('instructorName') || 'Instructor Name'}</label>
                <input
                  type="text"
                  value={formData.instructor.name}
                  onChange={(e) => handleInstructorChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{t('email') || 'Email'}</label>
                <input
                  type="email"
                  value={formData.instructor.email}
                  onChange={(e) => handleInstructorChange('email', e.target.value)}
                />
              </div>
            </div>

            {/* Instructor Titles */}
            <div className="form-section">
              <label className="section-label">
                {t('instructorTitles') || 'Instructor Titles'}
              </label>
              
              <div className="language-inputs">
                <div className="language-input">
                  <label>{t('english') || 'English'}</label>
                  <input
                    type="text"
                    value={formData.instructor.title.en}
                    onChange={(e) => handleInstructorChange('title', e.target.value, 'en')}
                    placeholder={t('enterTitleEnglish') || 'Enter title in English'}
                  />
                </div>
                
                <div className="language-input">
                  <label>{t('turkish') || 'Türkçe'}</label>
                  <input
                    type="text"
                    value={formData.instructor.title.tr}
                    onChange={(e) => handleInstructorChange('title', e.target.value, 'tr')}
                    placeholder={t('enterTitleTurkish') || 'Unvanı Türkçe girin'}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="course-step-content">
            <h3 className="step-title">
              <Calendar size={20} />
              {t('scheduleInfo') || 'Schedule Information'}
            </h3>

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

            {/* Prerequisites */}
            <div className="form-section">
              <label className="section-label">
                {t('prerequisites') || 'Prerequisites'}
              </label>
              
              <div className="language-inputs">
                <div className="language-input">
                  <label>{t('english') || 'English'}</label>
                  <textarea
                    value={formData.prerequisites.en}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value, 'en')}
                    placeholder={t('enterPrerequisitesEnglish') || 'Enter prerequisites in English'}
                    rows={4}
                  />
                </div>
                
                <div className="language-input">
                  <label>{t('turkish') || 'Türkçe'}</label>
                  <textarea
                    value={formData.prerequisites.tr}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value, 'tr')}
                    placeholder={t('enterPrerequisitesTurkish') || 'Ön koşulları Türkçe girin'}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="form-section">
              <label className="section-label">
                {t('fullDescription') || 'Full Description'}
              </label>
              
              <div className="language-inputs">
                <div className="language-input">
                  <label>{t('english') || 'English'}</label>
                  <textarea
                    value={formData.fullDescription.en}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value, 'en')}
                    placeholder={t('enterFullDescEnglish') || 'Enter full description in English'}
                    rows={5}
                  />
                </div>
                
                <div className="language-input">
                  <label>{t('turkish') || 'Türkçe'}</label>
                  <textarea
                    value={formData.fullDescription.tr}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value, 'tr')}
                    placeholder={t('enterFullDescTurkish') || 'Tam açıklamayı Türkçe girin'}
                    rows={5}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="course-form-modal-overlay" onClick={onClose}>
      <div className="course-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>{t('addNewCourse') || 'Add New Course'}</h2>
            <div className="step-indicator">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                >
                  <div className="step-icon">
                    <step.icon size={16} />
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            {renderStepContent()}
          </div>

          <div className="modal-footer">
            <div className="step-navigation">
              <button
                type="button"
                className="nav-btn prev-btn"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                {t('previous') || 'Previous'}
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  className="nav-btn next-btn"
                  onClick={nextStep}
                >
                  {t('next') || 'Next'}
                </button>
              ) : (
                <button
                  type="submit"
                  className="nav-btn submit-btn"
                  disabled={imageUploading || instructorImageUploading}
                >
                  {t('createCourse') || 'Create Course'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseFormModal