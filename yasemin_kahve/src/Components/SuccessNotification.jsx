import React, { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import './SuccessNotification.css'

const SuccessNotification = ({ 
  isVisible, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully",
  autoClose = true,
  duration = 4000 
}) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, duration])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className={`success-notification-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`success-notification ${isClosing ? 'slide-out' : 'slide-in'}`}>
        <div className="notification-content">
          <div className="notification-icon">
            <CheckCircle size={24} />
          </div>
          <div className="notification-text">
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
          <button className="notification-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        {autoClose && (
          <div className="notification-progress">
            <div 
              className="progress-bar" 
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuccessNotification