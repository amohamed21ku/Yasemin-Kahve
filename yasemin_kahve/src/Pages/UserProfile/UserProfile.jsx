import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Edit, Save, X, BookOpen, Calendar, Award } from 'lucide-react'
import { useAuth } from '../../AuthContext'
import { useTranslation } from '../../useTranslation'
import { useEnrollment } from '../../useEnrollment'
import './UserProfile.css'

const UserProfile = ({ onNavigate }) => {
  const { currentUser, getUserData, updateUserProfile } = useAuth()
  const { getUserEnrollments } = useEnrollment()
  const { t } = useTranslation()
  const [userData, setUserData] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentUser) {
      loadUserData()
    }
  }, [currentUser])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const [userData, userEnrollments] = await Promise.all([
        getUserData(currentUser.uid),
        getUserEnrollments()
      ])
      
      if (userData) {
        setUserData(userData)
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || currentUser.email || '',
          phoneNumber: userData.phoneNumber || ''
        })
      }
      
      setEnrollments(userEnrollments)
    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      
      await updateUserProfile(currentUser.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        displayName: `${formData.firstName} ${formData.lastName}`.trim()
      })
      
      await loadUserData()
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || currentUser.email || '',
        phoneNumber: userData.phoneNumber || ''
      })
    }
    setEditing(false)
    setError(null)
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString()
  }

  const getEnrollmentStatus = (enrollment) => {
    if (enrollment.paymentStatus === 'completed' || enrollment.status === 'active') {
      return 'Active'
    }
    return 'Pending'
  }

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Authentication Required</h2>
          <p>Please sign in to access your profile.</p>
          <button onClick={() => onNavigate('register')} className="btn-primary">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          onClick={() => onNavigate('home')} 
          className="back-btn"
        >
          ← Back to Home
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <div className="avatar">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="Profile" />
              ) : (
                <User size={40} />
              )}
            </div>
            <div className="user-info">
              <h2>{userData?.displayName || userData?.firstName + ' ' + userData?.lastName || 'User'}</h2>
              <p>{userData?.email || currentUser.email}</p>
            </div>
            <button 
              className={`edit-btn ${editing ? 'cancel' : 'edit'}`}
              onClick={() => editing ? handleCancel() : setEditing(true)}
              disabled={saving}
            >
              {editing ? <X size={20} /> : <Edit size={20} />}
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                ) : (
                  <div className="form-value">{userData?.firstName || 'Not provided'}</div>
                )}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                ) : (
                  <div className="form-value">{userData?.lastName || 'Not provided'}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <div className="form-value email-field">
                {userData?.email || currentUser.email}
                <span className="email-note">Email cannot be changed</span>
              </div>
            </div>

            <div className="form-group">
              <label>
                <Phone size={16} />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="form-value">{userData?.phoneNumber || 'Not provided'}</div>
              )}
            </div>

            {editing && (
              <div className="form-actions">
                <button 
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="btn-spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="enrolled-courses-card">
          <div className="card-header">
            <div className="courses-icon">
              <BookOpen size={24} />
            </div>
            <h3>My Courses</h3>
          </div>

          <div className="courses-content">
            {enrollments.length === 0 ? (
              <div className="no-courses">
                <Award size={48} />
                <h4>No Courses Yet</h4>
                <p>Start your learning journey by enrolling in a course!</p>
                <button 
                  onClick={() => onNavigate('academy')} 
                  className="btn-primary"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="courses-grid">
                {enrollments.map((enrollment, index) => (
                  <div key={index} className="course-item">
                    <div className="course-info">
                      <h4>{enrollment.courseTitle}</h4>
                      <div className="course-meta">
                        <span className="enrollment-date">
                          <Calendar size={14} />
                          Enrolled: {formatDate(enrollment.enrolledAt)}
                        </span>
                        <span className={`status ${getEnrollmentStatus(enrollment).toLowerCase()}`}>
                          {getEnrollmentStatus(enrollment)}
                        </span>
                      </div>
                      {enrollment.coursePrice && (
                        <div className="course-price">
                          {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY'
                          }).format(enrollment.coursePrice)}
                        </div>
                      )}
                    </div>
                    <div className="course-actions">
                      <button className="btn-secondary">
                        View Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="account-info-card">
          <h3>Account Information</h3>
          <div className="account-details">
            <div className="info-item">
              <label>Member Since:</label>
              <span>{formatDate(userData?.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>{formatDate(userData?.lastLogin)}</span>
            </div>
            <div className="info-item">
              <label>Account Provider:</label>
              <span className="provider">
                {userData?.provider === 'google' ? 'Google' : 'Email'}
              </span>
            </div>
            {userData?.isAdmin && (
              <div className="info-item">
                <label>Role:</label>
                <span className="admin-badge">Administrator</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile