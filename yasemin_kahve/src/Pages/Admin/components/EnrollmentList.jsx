import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Ban, CheckCircle, Clock, User, Mail, MailCheck, DollarSign, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { cancelEnrollment } from '../../../services/courseService'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import './EnrollmentList.css'

const EnrollmentList = ({ enrollments, courses, onRefresh }) => {
  const { t, language } = useTranslation()
  const [localEnrollments, setLocalEnrollments] = useState([])
  const [filteredEnrollments, setFilteredEnrollments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseSort, setCourseSort] = useState('none')
  const [studentDetails, setStudentDetails] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLocalEnrollments(enrollments)
  }, [enrollments])

  useEffect(() => {
    fetchStudentDetails()
  }, [localEnrollments])

  useEffect(() => {
    filterEnrollments()
  }, [localEnrollments, searchTerm, statusFilter, courseSort, studentDetails])

  const fetchStudentDetails = async () => {
    try {
      setLoading(true)
      const uniqueUserIds = [...new Set(localEnrollments.map(e => e.userId))]
      const studentData = {}

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId))
            if (userDoc.exists()) {
              studentData[userId] = userDoc.data()
            } else {
              studentData[userId] = {
                displayName: 'Unknown User',
                email: 'N/A',
                firstName: 'Unknown',
                lastName: 'User'
              }
            }
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error)
            studentData[userId] = {
              displayName: 'Error Loading',
              email: 'N/A',
              firstName: 'Error',
              lastName: 'Loading'
            }
          }
        })
      )

      setStudentDetails(studentData)
    } catch (error) {
      console.error('Error fetching student details:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterEnrollments = () => {
    let filtered = [...localEnrollments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enrollment => {
        const student = studentDetails[enrollment.userId]
        const course = courses.find(c => c.id === enrollment.courseId)
        const studentName = student ? 
          `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase() : ''
        const studentEmail = student ? student.email.toLowerCase() : ''
        const courseName = course ? 
          `${course.title?.en || ''} ${course.title?.tr || ''}`.toLowerCase() : ''
        
        return studentName.includes(searchTerm.toLowerCase()) ||
               studentEmail.includes(searchTerm.toLowerCase()) ||
               courseName.includes(searchTerm.toLowerCase())
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter)
    }

    // Course filtering by specific course
    if (courseSort !== 'none') {
      filtered = filtered.filter(enrollment => enrollment.courseId === courseSort)
    }

    setFilteredEnrollments(filtered)
  }

  const handleCancelEnrollment = async (enrollment) => {
    if (window.confirm(t('confirmCancelEnrollment') || 'Are you sure you want to cancel this enrollment?')) {
      try {
        await cancelEnrollment(enrollment.id, enrollment.courseId, enrollment.userId)
        onRefresh()
        alert(t('enrollmentCancelled') || 'Enrollment cancelled successfully!')
      } catch (error) {
        console.error('Error cancelling enrollment:', error)
        alert(t('cancelEnrollmentError') || 'Error cancelling enrollment. Please try again.')
      }
    }
  }

  const handleContactedToggle = async (enrollmentId, currentStatus) => {
    try {
      // Update local state immediately for instant UI feedback
      setLocalEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { 
                ...enrollment, 
                contacted: !currentStatus,
                contactedAt: !currentStatus ? new Date() : null
              }
            : enrollment
        )
      )
      
      // Update database in background
      const enrollmentRef = doc(db, 'enrollments', enrollmentId)
      await updateDoc(enrollmentRef, {
        contacted: !currentStatus,
        contactedAt: !currentStatus ? new Date() : null
      })
    } catch (error) {
      console.error('Error updating contacted status:', error)
      // Revert local state on error
      setLocalEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { 
                ...enrollment, 
                contacted: currentStatus,
                contactedAt: enrollment.contactedAt
              }
            : enrollment
        )
      )
      alert('Error updating contacted status. Please try again.')
    }
  }

  const handlePaymentToggle = async (enrollmentId, currentStatus) => {
    try {
      // Update local state immediately for instant UI feedback
      setLocalEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { 
                ...enrollment, 
                paid: !currentStatus,
                paidAt: !currentStatus ? new Date() : null
              }
            : enrollment
        )
      )
      
      // Update database in background
      const enrollmentRef = doc(db, 'enrollments', enrollmentId)
      await updateDoc(enrollmentRef, {
        paid: !currentStatus,
        paidAt: !currentStatus ? new Date() : null
      })
    } catch (error) {
      console.error('Error updating payment status:', error)
      // Revert local state on error
      setLocalEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { 
                ...enrollment, 
                paid: currentStatus,
                paidAt: enrollment.paidAt
              }
            : enrollment
        )
      )
      alert('Error updating payment status. Please try again.')
    }
  }

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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportEnrollments = () => {
    const csv = [
      ['Student Name', 'Email', 'Course', 'Enrollment Date', 'Status', 'Amount Paid'].join(','),
      ...filteredEnrollments.map(enrollment => {
        const student = studentDetails[enrollment.userId]
        const course = courses.find(c => c.id === enrollment.courseId)
        return [
          `"${student ? `${student.firstName || ''} ${student.lastName || ''}` : 'Unknown'}"`,
          `"${student ? student.email : 'N/A'}"`,
          `"${course ? getLocalizedText(course.title) : 'Unknown Course'}"`,
          `"${formatDate(enrollment.enrolledAt)}"`,
          `"${enrollment.status || 'active'}"`,
          `"${formatPrice(enrollment.paymentInfo?.amount || 0)}"`
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `enrollments-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="enrollment-list loading">
        <div className="loading-spinner"></div>
        <p>{t('loadingEnrollments') || 'Loading enrollments...'}</p>
      </div>
    )
  }

  return (
    <div className="enrollment-list">
      <div className="enrollment-controls">
        <div className="search-filter">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder={t('searchEnrollments') || 'Search by student or course...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">{t('allStatuses') || 'All Statuses'}</option>
            <option value="active">{t('active') || 'Active'}</option>
            <option value="cancelled">{t('cancelled') || 'Cancelled'}</option>
            <option value="completed">{t('completed') || 'Completed'}</option>
          </select>

          <select 
            value={courseSort} 
            onChange={(e) => setCourseSort(e.target.value)}
            className="course-sort"
          >
            <option value="none">{t('sortByCourse') || 'Sort by Course'}</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {getLocalizedText(course.title)}
              </option>
            ))}
          </select>
        </div>

        <button onClick={exportEnrollments} className="export-btn">
          <Download size={18} />
          {t('exportCSV') || 'Export CSV'}
        </button>
      </div>

      <div className="enrollment-stats">
        <div className="stat-item">
          <span className="stat-number">{localEnrollments.length}</span>
          <span className="stat-label">{t('totalEnrollments') || 'Total'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {localEnrollments.filter(e => e.status === 'active').length}
          </span>
          <span className="stat-label">{t('active') || 'Active'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {localEnrollments.filter(e => e.status === 'cancelled').length}
          </span>
          <span className="stat-label">{t('cancelled') || 'Cancelled'}</span>
        </div>
      </div>

      <div className="enrollment-table">
        <table>
          <thead>
            <tr>
              <th>{t('student') || 'Student'}</th>
              <th>{t('course') || 'Course'}</th>
              <th>{t('enrollmentDate') || 'Enrollment Date'}</th>
              <th>{t('amount') || 'Amount'}</th>
              <th>{t('status') || 'Status'}</th>
              <th>{t('contacted') || 'Contacted'}</th>
              <th>{t('paid') || 'Paid'}</th>
              <th>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.map(enrollment => {
              const student = studentDetails[enrollment.userId]
              const course = courses.find(c => c.id === enrollment.courseId)
              
              return (
                <tr key={enrollment.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {student?.photoURL ? (
                          <img src={student.photoURL} alt={student.displayName} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div className="student-details">
                        <strong>
                          {student ? 
                            `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.displayName || 'Unknown User'
                            : 'Unknown User'
                          }
                        </strong>
                        <p>{student ? student.email : 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      {course ? (
                        <>
                          <strong>{getLocalizedText(course.title)}</strong>
                          <p>{getLocalizedText(course.level)}</p>
                        </>
                      ) : (
                        <span className="unknown-course">Unknown Course</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(enrollment.enrolledAt)}</td>
                  <td>
                    <span className="amount">
                      {formatPrice(enrollment.paymentInfo?.amount || 0)}
                    </span>
                    {enrollment.paymentInfo?.isTest && (
                      <span className="test-badge">TEST</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${enrollment.status || 'active'}`}>
                      {enrollment.status === 'active' && <CheckCircle size={14} />}
                      {enrollment.status === 'cancelled' && <Ban size={14} />}
                      {enrollment.status === 'completed' && <CheckCircle size={14} />}
                      {(enrollment.status || 'active').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`toggle-btn ${enrollment.contacted ? 'contacted' : 'not-contacted'}`}
                      onClick={() => handleContactedToggle(enrollment.id, enrollment.contacted)}
                      title={enrollment.contacted ? t('markAsNotContacted') || 'Mark as Not Contacted' : t('markAsContacted') || 'Mark as Contacted'}
                    >
                      {enrollment.contacted ? <MailCheck size={16} /> : <Mail size={16} />}
                      {enrollment.contacted ? t('yes') || 'Yes' : t('no') || 'No'}
                    </button>
                  </td>
                  <td>
                    <button 
                      className={`toggle-btn ${enrollment.paid ? 'paid' : 'not-paid'}`}
                      onClick={() => handlePaymentToggle(enrollment.id, enrollment.paid)}
                      title={enrollment.paid ? t('markAsNotPaid') || 'Mark as Not Paid' : t('markAsPaid') || 'Mark as Paid'}
                    >
                      {enrollment.paid ? <Check size={16} /> : <X size={16} />}
                      {enrollment.paid ? t('yes') || 'Yes' : t('no') || 'No'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {enrollment.status === 'active' && (
                        <button 
                          className="action-btn cancel"
                          title={t('cancelEnrollment') || 'Cancel Enrollment'}
                          onClick={() => handleCancelEnrollment(enrollment)}
                        >
                          <Ban size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {filteredEnrollments.length === 0 && (
          <div className="no-enrollments">
            <User size={48} />
            <h3>{t('noEnrollmentsFound') || 'No enrollments found'}</h3>
            <p>{t('tryDifferentSearchOrFilter') || 'Try adjusting your search or filter criteria'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrollmentList