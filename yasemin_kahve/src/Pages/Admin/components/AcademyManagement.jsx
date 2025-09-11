import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Monitor,
  MapPin,
  Search,
  Filter,
  Download,
  Eye,
  DollarSign,
  Database,
  User
} from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getAllEnrollments,
  getCourseStats
} from '../../../services/courseService'
import {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor
} from '../../../services/instructorService'
import { addSampleCourses } from '../../../utils/sampleCourseData'
import CourseForm from './CourseForm'
import EnrollmentList from './EnrollmentList'
import AdminCourseDetail from './AdminCourseDetail'
import InstructorManagement from './InstructorManagement'
import './AcademyManagement.css'

const AcademyManagement = () => {
  const { t, language } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0
  })

  useEffect(() => {
    fetchData()
    fetchInstructors()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [coursesData, enrollmentsData] = await Promise.all([
        getAllCourses(),
        getAllEnrollments()
      ])
      
      setCourses(coursesData)
      setEnrollments(enrollmentsData)
      
      // Calculate stats
      const uniqueStudents = new Set(enrollmentsData.map(e => e.userId)).size
      const averageRating = coursesData.length > 0 
        ? coursesData.reduce((sum, c) => sum + (c.rating || 0), 0) / coursesData.length 
        : 0

      setStats({
        totalCourses: coursesData.length,
        totalStudents: uniqueStudents,
        averageRating: Math.round(averageRating * 10) / 10
      })
    } catch (error) {
      console.error('Error fetching academy data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (courseData) => {
    try {
      await createCourse(courseData)
      await fetchData()
      setShowCourseForm(false)
      alert(t('courseCreatedSuccess') || 'Course created successfully!')
    } catch (error) {
      console.error('Error creating course:', error)
      alert(t('courseCreateError') || 'Error creating course. Please try again.')
    }
  }

  const handleUpdateCourse = async (courseData) => {
    try {
      await updateCourse(editingCourse.id, courseData)
      await fetchData()
      setShowCourseForm(false)
      setEditingCourse(null)
      alert(t('courseUpdatedSuccess') || 'Course updated successfully!')
    } catch (error) {
      console.error('Error updating course:', error)
      alert(t('courseUpdateError') || 'Error updating course. Please try again.')
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm(t('confirmDeleteCourse') || 'Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId)
        await fetchData()
        alert(t('courseDeletedSuccess') || 'Course deleted successfully!')
      } catch (error) {
        console.error('Error deleting course:', error)
        alert(t('courseDeleteError') || 'Error deleting course. Please try again.')
      }
    }
  }

  // Instructor Management Functions
  const fetchInstructors = async () => {
    try {
      const instructorsData = await getAllInstructors()
      setInstructors(instructorsData)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const handleCreateInstructor = async (instructorData) => {
    try {
      await createInstructor(instructorData)
      await fetchInstructors()
      alert(t('instructorCreatedSuccess') || 'Instructor created successfully!')
    } catch (error) {
      console.error('Error creating instructor:', error)
      alert(t('instructorCreateError') || 'Error creating instructor. Please try again.')
    }
  }

  const handleUpdateInstructor = async (instructorData) => {
    try {
      await updateInstructor(instructorData.id, instructorData)
      await fetchInstructors()
      alert(t('instructorUpdatedSuccess') || 'Instructor updated successfully!')
    } catch (error) {
      console.error('Error updating instructor:', error)
      alert(t('instructorUpdateError') || 'Error updating instructor. Please try again.')
    }
  }

  const handleDeleteInstructor = async (instructorId) => {
    try {
      await deleteInstructor(instructorId)
      await fetchInstructors()
      alert(t('instructorDeletedSuccess') || 'Instructor deleted successfully!')
    } catch (error) {
      console.error('Error deleting instructor:', error)
      alert(t('instructorDeleteError') || 'Error deleting instructor. Please try again.')
    }
  }

  const handleAddSampleData = async () => {
    if (window.confirm(t('confirmAddSampleData') || 'This will add 6 sample courses to the database. Continue?')) {
      try {
        setLoading(true)
        await addSampleCourses()
        await fetchData()
        alert(t('sampleDataAdded') || 'Sample courses added successfully!')
      } catch (error) {
        console.error('Error adding sample data:', error)
        alert(t('sampleDataError') || 'Error adding sample data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    setShowCourseDetail(true)
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = getLocalizedText(course.title).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || course.courseType === filterType
    return matchesSearch && matchesType
  })

  const tabs = [
    { id: 'overview', label: t('overview') || 'Overview', icon: TrendingUp },
    { id: 'courses', label: t('courses') || 'Courses', icon: BookOpen },
    { id: 'instructors', label: t('instructors') || 'Instructors', icon: User },
    { id: 'enrollments', label: t('enrollments') || 'Enrollments', icon: Users },
  ]

  if (loading) {
    return (
      <div className="academy-management loading">
        <div className="loading-spinner"></div>
        <p>{t('loadingAcademyData') || 'Loading academy data...'}</p>
      </div>
    )
  }

  if (showCourseDetail && selectedCourse) {
    return (
      <AdminCourseDetail
        course={selectedCourse}
        instructors={instructors}
        onBack={() => {
          setShowCourseDetail(false)
          setSelectedCourse(null)
        }}
        onUpdate={fetchData}
      />
    )
  }

  return (
    <div className="academy-management">
      <div className="academy-management-header">
        <h2>{t('academyManagement') || 'Academy Management'}</h2>
        <div className="header-actions">
         
          <button 
            className="add-course-btn"
            onClick={() => setShowCourseForm(true)}
          >
            <Plus size={20} />
            {t('addCourse') || 'Add Course'}
          </button>
        </div>
      </div>

      <div className="academy-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="academy-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon courses">
                  <BookOpen size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{stats.totalCourses}</span>
                  <span className="stat-label">{t('totalCourses') || 'Total Courses'}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon students">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-number">{stats.totalStudents}</span>
                  <span className="stat-label">{t('totalStudents') || 'Total Students'}</span>
                </div>
              </div>


            
            </div>

            <div className="recent-activity">
              <h3>{t('recentEnrollments') || 'Recent Enrollments'}</h3>
              <div className="activity-list">
                {enrollments.slice(0, 5).map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.courseId)
                  return (
                    <div key={enrollment.id} className="activity-item">
                      <div className="activity-info">
                        <span className="student-name">
                          {enrollment.userId.substring(0, 8)}...
                        </span>
                        <span className="course-name">
                          {course ? getLocalizedText(course.title) : 'Unknown Course'}
                        </span>
                      </div>
                      <span className="enrollment-date">
                        {new Date(enrollment.enrolledAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-tab">
            <div className="courses-controls">
              <div className="search-filter">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder={t('searchCourses') || 'Search courses...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="type-filter"
                >
                  <option value="all">{t('allTypes') || 'All Types'}</option>
                  <option value="Online">{t('online') || 'Online'}</option>
                  <option value="On Site">{t('onSite') || 'On Site'}</option>
                </select>
              </div>
            </div>

            <div className="courses-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('course') || 'Course'}</th>
                    <th>{t('type') || 'Type'}</th>
                    <th>{t('price') || 'Price'}</th>
                    <th>{t('enrollments') || 'Enrollments'}</th>
                    <th>{t('actions') || 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="clickable-row">
                      <td>
                        <div 
                          className="course-info"
                          onClick={() => handleCourseClick(course)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img 
                            src={course.image} 
                            alt={getLocalizedText(course.title)}
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f8f5f0'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='%23D2691E'%3E📚%3C/text%3E%3C/svg%3E"
                            }}
                          />
                          <div>
                            <strong>{getLocalizedText(course.title)}</strong>
                            <p>{course.level}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge" data-type={course.courseType || 'On Site'}>
                          {course.courseType === 'Online' ? (
                            <><Monitor size={14} /> {t('online') || 'Online'}</>
                          ) : (
                            <><MapPin size={14} /> {t('onSite') || 'On Site'}</>
                          )}
                        </span>
                      </td>
                      <td>{formatPrice(course.price)}</td>
                      <td>
                        <span className="enrollment-count">
                          {course.enrolledStudents?.length || 0}/{course.maxStudents}
                        </span>
                      </td>
                    
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit"
                            onClick={() => {
                              setEditingCourse(course)
                              setShowCourseForm(true)
                            }}
                            title={t('editCourse') || 'Edit Course'}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteCourse(course.id)}
                            title={t('deleteCourse') || 'Delete Course'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCourses.length === 0 && (
                <div className="no-courses">
                  <BookOpen size={48} />
                  <h3>{t('noCoursesFound') || 'No courses found'}</h3>
                  <p>{t('tryDifferentSearch') || 'Try adjusting your search criteria'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'instructors' && (
          <InstructorManagement
            instructors={instructors}
            onCreateInstructor={handleCreateInstructor}
            onUpdateInstructor={handleUpdateInstructor}
            onDeleteInstructor={handleDeleteInstructor}
          />
        )}

        {activeTab === 'enrollments' && (
          <EnrollmentList 
            enrollments={enrollments}
            courses={courses}
            onRefresh={fetchData}
          />
        )}
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          instructors={instructors}
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          onCancel={() => {
            setShowCourseForm(false)
            setEditingCourse(null)
          }}
        />
      )}
    </div>
  )
}

export default AcademyManagement