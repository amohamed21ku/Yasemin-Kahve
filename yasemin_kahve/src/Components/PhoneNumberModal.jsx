import React, { useState } from 'react'
import { X, Phone } from 'lucide-react'
import { useAuth } from '../AuthContext'
import { useTranslation } from '../useTranslation'
import './PhoneNumberModal.css'

const PhoneNumberModal = ({ isOpen, onClose, onSuccess, userData }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { updateUserProfile, currentUser } = useAuth()
  const { t } = useTranslation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!phoneNumber.trim()) {
      setError(t('phoneRequired') || 'Phone number is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await updateUserProfile(currentUser.uid, {
        phoneNumber: phoneNumber.trim()
      })
      
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Error updating phone number:', err)
      setError(err.message || 'Failed to update phone number')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="phone-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleSkip()}>
      <div className="phone-modal-content">
        <div className="phone-modal-header">
          <button className="close-btn" onClick={handleSkip}>
            <X size={20} />
          </button>
          
          <div className="phone-icon">
            <Phone size={32} />
          </div>
          
          <h2>{t('addPhoneNumber') || 'Add Phone Number'}</h2>
          <p>
            {t('phoneNumberHelp') || 'Please provide your phone number to complete your account setup. This helps us provide better support and communication.'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="phone-form">
          <div className="form-group">
            <label htmlFor="phoneNumber">
              <Phone size={16} />
              {t('phoneNumber') || 'Phone Number'}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+90 5XX XXX XX XX"
              className="phone-input"
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="skip-button"
              onClick={handleSkip}
              disabled={loading}
            >
              {t('skipForNow') || 'Skip for now'}
            </button>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  {t('saving') || 'Saving...'}
                </div>
              ) : (
                t('savePhoneNumber') || 'Save Phone Number'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PhoneNumberModal