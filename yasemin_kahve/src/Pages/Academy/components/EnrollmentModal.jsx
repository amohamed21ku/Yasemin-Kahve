import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, User, Phone } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { useAuth } from '../../../AuthContext'
import { enrollStudent } from '../../../services/courseService'
import './EnrollmentModal.css'

const EnrollmentModal = ({ course, isOpen, onClose, onEnroll }) => {
  const { t, language } = useTranslation()
  const { currentUser, getUserData, updateUserProfile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const [userDataLoaded, setUserDataLoaded] = useState(false)

  // Populate form with existing user data
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser && isOpen && !userDataLoaded) {
        try {
          const userData = await getUserData(currentUser.uid)
          if (userData) {
            setFormData(prev => ({
              ...prev,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              phoneNumber: userData.phoneNumber || '',
              email: userData.email || currentUser.email || ''
            }))
          } else {
            // If no user data exists, use basic info from auth
            setFormData(prev => ({
              ...prev,
              email: currentUser.email || ''
            }))
          }
          setUserDataLoaded(true)
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
    }

    loadUserData()
  }, [currentUser, isOpen, getUserData, userDataLoaded])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUserDataLoaded(false)
      setErrors({})
    }
  }, [isOpen])

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }


  const validateForm = () => {
    const newErrors = {}

    // User information validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t("firstNameRequired") || "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("lastNameRequired") || "Last name is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("phoneNumberRequired") || "Phone number is required"
    } else {
      // Basic phone number validation
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = t("invalidPhoneNumber") || "Please enter a valid phone number"
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired") || "Email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("invalidEmail") || "Please enter a valid email address"
      }
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t("agreeToTerms") || "Please agree to terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEnroll = async () => {
    if (!validateForm()) return
    
    // Double-check that user is authenticated
    if (!currentUser) {
      setErrors({ general: t("userNotAuthenticated") || "User not authenticated. Please sign in again." })
      return
    }

    setIsProcessing(true)

    try {
      // Validate course data
      if (!course || !course.id) {
        throw new Error("Course information is missing. Please try refreshing the page.")
      }

      // First, update user profile with the collected information
      const userProfileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim()
      }

      // Update user profile in Firebase
      await updateUserProfile(currentUser.uid, userProfileData)

      // Simulate enrollment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Process enrollment in Firebase (no payment required)
      const enrollmentData = {
        enrollmentType: 'free',
        amount: course.price || 0,
        method: 'free',
        studentInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim()
        }
      }
      
      console.log('Enrolling with data:', enrollmentData)
      await enrollStudent(course.id, currentUser.uid, enrollmentData)
      
      // Call parent enrollment handler
      if (onEnroll) {
        onEnroll(course)
      }
      
      onClose()
    } catch (error) {
      console.error('Enrollment error:', error)
      
      // Provide more specific error messages
      let errorMessage = t("enrollmentError") || "An error occurred during enrollment. Please try again."
      
      if (error.message.includes('permission')) {
        errorMessage = "You don't have permission to enroll. Please sign in again."
      } else if (error.message.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (error.message.includes('Course information')) {
        errorMessage = error.message
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen || !course) return null
  
  // Show loading state if user is not yet authenticated
  if (!currentUser) {
    return (
      <div className="enrollment-modal-overlay">
        <div className="enrollment-modal">
          <div className="modal-content" style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p>{t("loadingUserData") || "Loading user data..."}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="enrollment-modal-overlay" onClick={onClose}>
      <div className="enrollment-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2>{t("enrollInCourse") || "Enroll in Course"}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        
        {/* Course Summary */}
        <div className="course-summary">
          <img src={course.image} alt={getLocalizedText(course.title)} />
          <div>
            <h3>{getLocalizedText(course.title)}</h3>
            <p className="course-price">{formatPrice(course.price)}</p>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="error-message">
            <AlertCircle size={16} />
            {errors.general}
          </div>
        )}

        {/* Personal Information Section */}
        <div className="user-information-section">
          <h4 className="section-title">
            <User size={16} />
            {t("personalInformation") || "Personal Information"}
          </h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t("firstName") || "First Name"} *</label>
              <input
                type="text"
                placeholder={t("firstNamePlaceholder") || "Enter your first name"}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>{t("lastName") || "Last Name"} *</label>
              <input
                type="text"
                placeholder={t("lastNamePlaceholder") || "Enter your last name"}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>
              <Phone size={16} />
              {t("phoneNumber") || "Phone Number"} *
            </label>
            <input
              type="tel"
              placeholder="+90 555 123 4567"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label>{t("email") || "Email Address"} *</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        {/* Terms Section */}
        <div className="terms-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className={errors.agreeTerms ? 'error' : ''}>
              {t("agreeToTermsText") || "I agree to the terms and conditions and privacy policy"}
            </span>
          </label>
          {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}
        </div>

        {/* Footer with Buttons */}
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">
            {t("cancel") || "Cancel"}
          </button>
          <button
            onClick={handleEnroll}
            disabled={isProcessing}
            className={`enroll-btn ${isProcessing ? 'processing' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                {t("processing") || "Processing..."}
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {t("enrollNow") || "Enroll Now"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentModal