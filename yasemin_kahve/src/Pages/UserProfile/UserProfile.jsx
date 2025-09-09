import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Edit, Save, X, BookOpen, Calendar, Award, Settings, MapPin, Clock, Shield } from 'lucide-react'
import { useAuth } from '../../AuthContext'
import { useTranslation } from '../../useTranslation'
import { useEnrollment } from '../../useEnrollment'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
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
          <button onClick={() => onNavigate('register')} className="btn-profile-primary">
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
        <div className="header-content">
          <h1>Profile Settings</h1>
          <p>Manage your account information and view your learning progress</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="main-content">
          <div className="profile-card">
            <div className="card-header">
              <div className="avatar-section">
                <div className="avatar">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div className="avatar-info">
                  <h2>{userData?.displayName || `${userData?.firstName} ${userData?.lastName}` || 'User'}</h2>
                  <p className="user-email">{userData?.email || currentUser.email}</p>
                  <div className="user-status">
                    <span className={`status-badge ${userData?.isAdmin ? 'admin' : 'member'}`}>
                      {userData?.isAdmin ? (
                        <><Shield size={14} /> Administrator</>
                      ) : (
                        <><User size={14} /> Member</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className={`edit-btn ${editing ? 'cancel' : 'edit'}`}
                onClick={() => editing ? handleCancel() : setEditing(true)}
                disabled={saving}
              >
                {editing ? <X size={18} /> : <Edit size={18} />}
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <X size={16} />
                {error}
              </div>
            )}

            <div className="profile-form">
              <div className="form-section">
                <h3 className="section-title">
                  <Settings size={20} />
                  Personal Information
                </h3>
                
                <div className="form-grid">
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
                    Email Address
                  </label>
                  <div className="form-value email-field">
                    <span>{userData?.email || currentUser.email}</span>
                    <span className="email-note">Cannot be changed</span>
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
                      placeholder="+90 5XX XXX XX XX"
                    />
                  ) : (
                    <div className="form-value">{userData?.phoneNumber || 'Not provided'}</div>
                  )}
                </div>
              </div>

              {editing && (
                <div className="form-actions">
                  <button 
                    className="btn-profile-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-profile-primary"
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
            <div className="section-header">
              <div className="header-left">
                <div className="courses-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3>My Learning</h3>
                  <p>Track your enrolled courses and progress</p>
                </div>
              </div>
              <div className="course-stats">
                <span className="stat">
                  <strong>{enrollments.length}</strong>
                  <span>Course{enrollments.length !== 1 ? 's' : ''}</span>
                </span>
              </div>
            </div>

            <div className="courses-content">
              {enrollments.length === 0 ? (
                <div className="no-courses">
                  <div className="empty-state">
                    <Award size={40} />
                    <h4>Start Your Learning Journey</h4>
                    <p>Discover our courses and expand your knowledge in coffee and business</p>
                    <button 
                      onClick={() => onNavigate('academy')} 
                      className="btn-profile-primary"
                    >
                      <BookOpen size={16} />
                      Browse Courses
                    </button>
                  </div>
                </div>
              ) : (
                <div className="courses-grid">
                  {enrollments.map((enrollment, index) => (
                    <div key={index} className="course-card">
                      <div className="course-header">
                        <div className="course-title">
                          <h4>{enrollment.courseTitle}</h4>
                          <span className={`status-pill ${getEnrollmentStatus(enrollment).toLowerCase()}`}>
                            {getEnrollmentStatus(enrollment)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="course-details">
                        <div className="detail-item">
                          <Calendar size={14} />
                          <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
                        </div>
                        
                        {enrollment.coursePrice && (
                          <div className="detail-item price">
                            <span className="course-price">
                              {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY'
                              }).format(enrollment.coursePrice)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="course-actions">
                        <button className="btn-outline">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="sidebar">

          <div className="account-info-card">
            <div className="section-header">
              <h3>
                <Clock size={18} />
                Account Information
              </h3>
            </div>
            
            <div className="account-details">
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} />
                  <span>Member Since</span>
                </div>
                <span className="info-value">{formatDate(userData?.createdAt) || 'Recently'}</span>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <Clock size={16} />
                  <span>Last Login</span>
                </div>
                <span className="info-value">{formatDate(userData?.lastLogin) || 'Today'}</span>
              </div>
              
              <div className="info-item">
                <div className="info-label">
                  <Shield size={16} />
                  <span>Account Provider</span>
                </div>
                <span className={`provider-badge ${userData?.provider || 'email'}`}>
                  {userData?.provider === 'google' ? 'Google' : 'Email'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     
    </div>
   
  )
  
}

export default UserProfile