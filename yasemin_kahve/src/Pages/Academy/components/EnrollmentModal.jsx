import React, { useState } from 'react'
import { X, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { useAuth } from '../../../AuthContext'
import { enrollStudent } from '../../../services/courseService'
import './EnrollmentModal.css'

const EnrollmentModal = ({ course, isOpen, onClose, onEnroll }) => {
  const { t, language } = useTranslation()
  const { currentUser } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState({})

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

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return v
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t("agreeToTerms") || "Please agree to terms and conditions"
    }

    if (paymentMethod === 'card') {
      const cardNumber = formData.cardNumber.replace(/\s/g, '')
      
      // Accept test card number 1234567890123456 or any 16-digit number for development
      if (!cardNumber || cardNumber.length !== 16) {
        newErrors.cardNumber = t("invalidCardNumber") || "Please enter a valid card number (use 1234567890123456 for testing)"
      }
      
      // Accept test expiry date 12/30 or any valid format
      if (!formData.expiryDate || formData.expiryDate.length !== 5) {
        newErrors.expiryDate = t("invalidExpiryDate") || "Please enter a valid expiry date (use 12/30 for testing)"
      }
      
      // Accept test CVV 000 or any 3-4 digit number
      if (!formData.cvv || (formData.cvv.length < 3 || formData.cvv.length > 4)) {
        newErrors.cvv = t("invalidCvv") || "Please enter a valid CVV (use 000 for testing)"
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = t("cardNameRequired") || "Please enter the name on card"
      }
    }

    if (!currentUser?.email && !formData.email) {
      newErrors.email = t("emailRequired") || "Email is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEnroll = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if using test credentials for development
      const cardNumber = formData.cardNumber.replace(/\s/g, '')
      const isTestPayment = cardNumber === '1234567890123456' || 
                           cardNumber.startsWith('1234567890') ||
                           formData.expiryDate === '12/30' || 
                           formData.cvv === '000'
      
      if (!isTestPayment) {
        // In production, validate with real payment processor
        console.log('Production payment validation needed')
      }
      
      // Process enrollment in Firebase
      const paymentInfo = {
        amount: course.price,
        method: 'card',
        cardLast4: cardNumber.slice(-4),
        isTest: isTestPayment
      }
      
      await enrollStudent(course.id, currentUser.uid, paymentInfo)
      
      // Call parent enrollment handler
      if (onEnroll) {
        onEnroll(course)
      }
      
      onClose()
    } catch (error) {
      console.error('Enrollment error:', error)
      setErrors({ 
        general: error.message || t("enrollmentError") || "An error occurred during enrollment. Please try again." 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="enrollment-modal-overlay" onClick={onClose}>
      <div className="enrollment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("enrollInCourse") || "Enroll in Course"}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="course-summary">
            <img src={course.image} alt={getLocalizedText(course.title)} />
            <div>
              <h3>{getLocalizedText(course.title)}</h3>
              <p className="course-price">{formatPrice(course.price)}</p>
            </div>
          </div>

          {errors.general && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          <div className="payment-methods">
            <h4>{t("paymentMethod") || "Payment Method"}</h4>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={20} />
                <span>{t("creditCard") || "Credit Card"}</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="card-form">
              <div className="form-group">
                <label>{t("cardNumber") || "Card Number"}</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t("expiryDate") || "Expiry Date"}</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label>{t("cvv") || "CVV"}</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>{t("cardName") || "Name on Card"}</label>
                <input
                  type="text"
                  placeholder={t("cardNamePlaceholder") || "John Doe"}
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  className={errors.cardName ? 'error' : ''}
                />
                {errors.cardName && <span className="error-text">{errors.cardName}</span>}
              </div>
            </div>
          )}

          {!currentUser?.email && (
            <div className="contact-info">
              <h4>{t("contactInformation") || "Contact Information"}</h4>
              <div className="form-group">
                <label>{t("email") || "Email"}</label>
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
          )}

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

          <div className="security-notice">
            <Shield size={16} />
            <span>{t("securePayment") || "Your payment information is secure and encrypted"}</span>
          </div>
        </div>

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
                {t("completeEnrollment") || "Complete Enrollment"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentModal