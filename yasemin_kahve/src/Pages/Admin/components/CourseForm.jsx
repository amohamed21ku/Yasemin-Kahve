import React, { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { uploadCourseImage, uploadInstructorAvatar } from '../../../services/courseStorageService'
import './CourseForm.css'

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: { en: '', tr: '' },
    shortDescription: { en: '', tr: '' },
    fullDescription: { en: '', tr: '' },
    level: '',
    category: '',
    courseType: 'In-site',
    duration: '',
    startDate: '',
    endDate: '',
    price: '',
    originalPrice: '',
    maxStudents: '',
    image: '',
    location: { en: '', tr: '' },
    prerequisites: { en: '', tr: '' },
    materials: [],
    curriculum: [],
    instructor: {
      name: '',
      avatar: '',
      title: { en: '', tr: '' },
      bio: { en: '', tr: '' }
    },
    rating: 4.5,
    isActive: true
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [instructorImageUploading, setInstructorImageUploading] = useState(false)
  const fileInputRef = useRef(null)
  const instructorFileInputRef = useRef(null)

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        // Ensure all required fields are present
        title: course.title || { en: '', tr: '' },
        shortDescription: course.shortDescription || { en: '', tr: '' },
        fullDescription: course.fullDescription || { en: '', tr: '' },
        level: course.level || '',
        location: course.location || { en: '', tr: '' },
        prerequisites: course.prerequisites || { en: '', tr: '' },
        materials: course.materials || [],
        curriculum: course.curriculum || [],
        instructor: {
          name: course.instructor?.name || '',
          avatar: course.instructor?.avatar || '',
          title: course.instructor?.title || { en: '', tr: '' },
          bio: course.instructor?.bio || { en: '', tr: '' }
        }
      })
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

    try {
      if (type === 'course') {
        setImageUploading(true)
      } else {
        setInstructorImageUploading(true)
      }

      // Generate temporary course ID for new courses
      const courseId = course?.id || `temp-${Date.now()}`
      
      let imageUrl
      if (type === 'course') {
        imageUrl = await uploadCourseImage(courseId, file)
        handleInputChange('image', imageUrl)
      } else {
        imageUrl = await uploadInstructorAvatar(courseId, file)
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

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { en: '', tr: '' }]
    }))
  }

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  const updateMaterial = (index, lang, value) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index 
          ? { ...material, [lang]: value }
          : material
      )
    }))
  }

  const addCurriculumModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, {
        title: { en: '', tr: '' },
        duration: 1,
        lessons: [{ en: '', tr: '' }]
      }]
    }))
  }

  const removeCurriculumModule = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }))
  }

  const updateCurriculumModule = (index, field, value, lang = null) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) => 
        i === index 
          ? lang 
            ? { ...module, [field]: { ...module[field], [lang]: value } }
            : { ...module, [field]: value }
          : module
      )
    }))
  }

  const addLesson = (moduleIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) => 
        i === moduleIndex 
          ? { ...module, lessons: [...module.lessons, { en: '', tr: '' }] }
          : module
      )
    }))
  }

  const removeLesson = (moduleIndex, lessonIndex) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) => 
        i === moduleIndex 
          ? { ...module, lessons: module.lessons.filter((_, j) => j !== lessonIndex) }
          : module
      )
    }))
  }

  const updateLesson = (moduleIndex, lessonIndex, lang, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.map((lesson, j) =>
                j === lessonIndex 
                  ? { ...lesson, [lang]: value }
                  : lesson
              )
            }
          : module
      )
    }))
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

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      maxStudents: parseInt(formData.maxStudents),
      duration: parseInt(formData.duration)
    })
  }

  return (
    <div className="course-form-overlay">
      <div className="course-form-modal">
        <div className="course-form-header">
          <h2>
            {course 
              ? (t('editCourse') || 'Edit Course')
              : (t('addNewCourse') || 'Add New Course')
            }
          </h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form className="course-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>{t('basicInformation') || 'Basic Information'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('courseTitleEn') || 'Course Title (English)'} *</label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('courseTitleTr') || 'Course Title (Turkish)'} *</label>
                <input
                  type="text"
                  value={formData.title.tr}
                  onChange={(e) => handleInputChange('title', e.target.value, 'tr')}
                  required
                />
              </div>
            </div>

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
                  <option value="In-site">{t('inSite') || 'In-site'}</option>
                  <option value="Videos">{t('videos') || 'Videos'}</option>
                </select>
              </div>
            </div>

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

            <div className="form-group image-upload-group">
              <label>{t('courseImage') || 'Course Image'}</label>
              <div className="image-upload-container">
                <div className="image-preview">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Course preview" 
                      className="preview-image"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <ImageIcon size={48} />
                      <span>{t('noImageSelected') || 'No image selected'}</span>
                    </div>
                  )}
                </div>
                <div className="image-upload-controls">
                  <button 
                    type="button" 
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                  >
                    <Upload size={16} />
                    {imageUploading ? (t('uploading') || 'Uploading...') : (t('selectImage') || 'Select Image')}
                  </button>
                  {formData.image && (
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => handleInputChange('image', '')}
                    >
                      <Trash2 size={16} />
                      {t('removeImage') || 'Remove'}
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'course')}
                  style={{ display: 'none' }}
                />
                <div className="image-url-input">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder={t('orEnterImageUrl') || 'Or enter image URL...'}
                  />
                </div>
              </div>
            </div>

            {formData.courseType !== 'Videos' && (
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

          {/* Instructor Information */}
          <div className="form-section">
            <h3>{t('instructorInformation') || 'Instructor Information'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('instructorName') || 'Instructor Name'}</label>
                <input
                  type="text"
                  value={formData.instructor.name}
                  onChange={(e) => handleInstructorChange('name', e.target.value)}
                />
              </div>
              <div className="form-group instructor-avatar-group">
                <label>{t('instructorAvatar') || 'Instructor Avatar'}</label>
                <div className="avatar-upload-container">
                  <div className="avatar-preview">
                    {formData.instructor.avatar ? (
                      <img 
                        src={formData.instructor.avatar} 
                        alt="Instructor avatar" 
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <ImageIcon size={24} />
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
                      <Upload size={14} />
                      {instructorImageUploading ? (t('uploading') || 'Uploading...') : (t('selectAvatar') || 'Select Avatar')}
                    </button>
                    {formData.instructor.avatar && (
                      <button 
                        type="button" 
                        className="remove-avatar-btn"
                        onClick={() => handleInstructorChange('avatar', '')}
                      >
                        <Trash2 size={14} />
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
                  <input
                    type="url"
                    value={formData.instructor.avatar}
                    onChange={(e) => handleInstructorChange('avatar', e.target.value)}
                    placeholder={t('orEnterAvatarUrl') || 'Or enter avatar URL...'}
                    className="avatar-url-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('instructorTitleEn') || 'Instructor Title (English)'}</label>
                <input
                  type="text"
                  value={formData.instructor.title.en}
                  onChange={(e) => handleInstructorChange('title', e.target.value, 'en')}
                />
              </div>
              <div className="form-group">
                <label>{t('instructorTitleTr') || 'Instructor Title (Turkish)'}</label>
                <input
                  type="text"
                  value={formData.instructor.title.tr}
                  onChange={(e) => handleInstructorChange('title', e.target.value, 'tr')}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="submit-btn">
              {course 
                ? (t('updateCourse') || 'Update Course')
                : (t('createCourse') || 'Create Course')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseForm