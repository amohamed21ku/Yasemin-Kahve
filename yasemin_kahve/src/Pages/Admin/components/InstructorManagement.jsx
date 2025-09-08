import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, User, Upload, Image as ImageIcon } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { uploadInstructorAvatar } from '../../../services/courseStorageService'
import './InstructorManagement.css'

const InstructorManagement = ({ instructors, onCreateInstructor, onUpdateInstructor, onDeleteInstructor }) => {
  const { t, language } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    title: { en: '', tr: '' }
  })
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editingInstructor) {
      setFormData({
        name: editingInstructor.name || '',
        avatar: editingInstructor.avatar || '',
        title: editingInstructor.title || { en: '', tr: '' }
      })
    } else {
      setFormData({
        name: '',
        avatar: '',
        title: { en: '', tr: '' }
      })
    }
  }, [editingInstructor])

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

  const handleImageUpload = async (event) => {
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
      setImageUploading(true)
      const instructorId = editingInstructor?.id || `temp-${Date.now()}`
      const imageUrl = await uploadInstructorAvatar(instructorId, file)
      handleInputChange('avatar', imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(t('imageUploadError') || 'Error uploading image. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert(t('nameRequired') || 'Instructor name is required')
      return
    }

    if (!formData.title.en.trim() || !formData.title.tr.trim()) {
      alert(t('titleRequired') || 'Instructor title is required in both languages')
      return
    }

    const instructorData = {
      ...formData,
      id: editingInstructor?.id || Date.now().toString()
    }

    if (editingInstructor) {
      onUpdateInstructor(instructorData)
    } else {
      onCreateInstructor(instructorData)
    }

    setShowForm(false)
    setEditingInstructor(null)
  }

  const handleEdit = (instructor) => {
    setEditingInstructor(instructor)
    setShowForm(true)
  }

  const handleDelete = (instructor) => {
    if (window.confirm(t('confirmDeleteInstructor') || 'Are you sure you want to delete this instructor?')) {
      onDeleteInstructor(instructor.id)
    }
  }

  const getLocalizedText = (textObj, fallback = '') => {
    if (textObj && typeof textObj === 'object') {
      return textObj[language] || textObj.en || textObj.tr || fallback
    }
    return textObj || fallback
  }

  return (
    <div className="instructor-management">
      <div className="instructor-header">
        <h3>{t('instructorManagement') || 'Instructor Management'}</h3>
        <button 
          className="add-instructor-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          {t('addInstructor') || 'Add Instructor'}
        </button>
      </div>

      <div className="instructors-grid">
        {instructors.map(instructor => (
          <div key={instructor.id} className="instructor-card">
            <div className="instructor-avatar">
              {instructor.avatar ? (
                <img src={instructor.avatar} alt={instructor.name} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="instructor-info">
              <h4>{instructor.name}</h4>
              <p className="instructor-title">{getLocalizedText(instructor.title)}</p>
            </div>
            <div className="instructor-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(instructor)}
                title={t('editInstructor') || 'Edit Instructor'}
              >
                <Edit size={16} />
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(instructor)}
                title={t('deleteInstructor') || 'Delete Instructor'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {instructors.length === 0 && (
          <div className="no-instructors">
            <User size={48} />
            <h4>{t('noInstructors') || 'No instructors added yet'}</h4>
            <p>{t('addFirstInstructor') || 'Add your first instructor to get started'}</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="instructor-form-overlay">
          <div className="instructor-form-modal">
            <div className="instructor-form-header">
              <h3>
                {editingInstructor 
                  ? (t('editInstructor') || 'Edit Instructor')
                  : (t('addNewInstructor') || 'Add New Instructor')
                }
              </h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false)
                  setEditingInstructor(null)
                }}
              >
                ×
              </button>
            </div>

            <form className="instructor-form" onSubmit={handleSubmit}>
              <div className="form-group avatar-group">
                <label>{t('avatar') || 'Avatar'}</label>
                <div className="avatar-upload-container">
                  <div className="avatar-preview">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Preview" />
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
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                    >
                      <Upload size={16} />
                      {imageUploading ? (t('uploading') || 'Uploading...') : (t('selectAvatar') || 'Select Avatar')}
                    </button>
                    {formData.avatar && (
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => handleInputChange('avatar', '')}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('instructorName') || 'Instructor Name'} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('titleEn') || 'Title (English)'} *</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('titleTr') || 'Title (Turkish)'} *</label>
                  <input
                    type="text"
                    value={formData.title.tr}
                    onChange={(e) => handleInputChange('title', e.target.value, 'tr')}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false)
                    setEditingInstructor(null)
                  }}
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button type="submit" className="submit-btn">
                  {editingInstructor 
                    ? (t('updateInstructor') || 'Update Instructor')
                    : (t('createInstructor') || 'Create Instructor')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorManagement