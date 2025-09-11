import React, { useState, useEffect } from 'react'
import { Filter, Search, SlidersHorizontal, Loader } from 'lucide-react'
import CourseCard from './CourseCard'
import { useTranslation } from '../../../useTranslation'
import { getAllCourses } from '../../../services/courseService'
import { getAllInstructors } from '../../../services/instructorService'
import { useAuth } from '../../../AuthContext'
import './CourseGrid.css'

const CourseGrid = ({ onCourseClick, onEnroll, onAddNewCourse, refreshTrigger }) => {
  const { t } = useTranslation()
  const { currentUser } = useAuth()
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to get Firebase data first
        try {
          const [fetchedCourses, fetchedInstructors] = await Promise.all([
            getAllCourses(),
            getAllInstructors()
          ])
          
          setInstructors(fetchedInstructors)
          
          if (fetchedCourses && fetchedCourses.length > 0) {
            console.log('Successfully fetched courses from Firebase:', fetchedCourses.length)
            
            // Populate instructor data for courses
            const coursesWithInstructors = fetchedCourses.map(course => {
              if (course.instructorId && fetchedInstructors.length > 0) {
                const instructor = fetchedInstructors.find(inst => inst.id === course.instructorId)
                if (instructor) {
                  return {
                    ...course,
                    instructor: {
                      name: instructor.name,
                      avatar: instructor.avatar,
                      title: instructor.title
                    }
                  }
                }
              }
              return course
            })
            
            setCourses(coursesWithInstructors)
            setFilteredCourses(coursesWithInstructors)
          } else {
            console.log('No courses found in Firebase')
            setCourses([])
            setFilteredCourses([])
          }
        } catch (firebaseError) {
          console.error('Firebase error:', firebaseError.message)
          setError('Unable to load courses. Please check your connection and try again.')
          setCourses([])
          setFilteredCourses([])
        }
        
      } catch (fallbackError) {
        console.error('Critical error: Cannot load any course data:', fallbackError)
        setError('Unable to load courses. Please refresh the page and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [refreshTrigger])

  // Filter and search logic
  useEffect(() => {
    if (!courses || !Array.isArray(courses)) {
      setFilteredCourses([])
      return
    }
    
    let filtered = [...courses]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => {
        const title = typeof course.title === 'object' ? 
          Object.values(course.title).join(' ').toLowerCase() : 
          course.title.toLowerCase()
        const description = typeof course.shortDescription === 'object' ? 
          Object.values(course.shortDescription).join(' ').toLowerCase() : 
          course.shortDescription.toLowerCase()
        
        return title.includes(searchTerm.toLowerCase()) || 
               description.includes(searchTerm.toLowerCase())
      })
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => {
        const level = typeof course.level === 'object' ? 
          course.level.en.toLowerCase() : 
          course.level.toLowerCase()
        return level === selectedLevel.toLowerCase()
      })
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }


    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedLevel, selectedCategory])

  return (
    <div className="course-grid-container courses-section">
      <div className="course-grid-header">
        <div className="header-title-section">
          <h2 className="course-grid-title">{t("availableCourses") || "Available Courses"}</h2>
        </div>
        
        <div className="course-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder={t("searchCourses") || "Search courses..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
            {t("filters") || "Filters"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="course-filters">
          <div className="filter-group">
            <label>{t("level") || "Level"}</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="all">{t("allLevels") || "All Levels"}</option>
              <option value="beginner">{t("beginner") || "Beginner"}</option>
              <option value="intermediate">{t("intermediate") || "Intermediate"}</option>
              <option value="advanced">{t("advanced") || "Advanced"}</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t("category") || "Category"}</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">{t("allCategories") || "All Categories"}</option>
              <option value="basics">{t("basics") || "Basics"}</option>
              <option value="brewing">{t("brewing") || "Brewing"}</option>
              <option value="tasting">{t("tasting") || "Tasting"}</option>
              <option value="roasting">{t("roasting") || "Roasting"}</option>
              <option value="business">{t("business") || "Business"}</option>
              <option value="barista">{t("barista") || "Barista Skills"}</option>
            </select>
          </div>

        </div>
      )}

      <div className="course-grid-results">
        <p className="results-count">
          {filteredCourses.length} {t("coursesFound") || "courses found"}
        </p>
        
        {loading ? (
          <div className="loading-state">
            <Loader className="spinner" size={40} />
            <p>{t("loadingCourses") || "Loading courses..."}</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h3>{t("errorLoadingCourses") || "Error loading courses"}</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              {t("retry") || "Try Again"}
            </button>
          </div>
        ) : (
          <>
            <div className="course-grid">
              {filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <CourseCard
                    key={course?.id || `course_${index}`}
                    course={course}
                    onClick={onCourseClick}
                    onEnroll={onEnroll}
                  />
                ))
              ) : (
                <div className="no-courses">
                  <div className="no-courses-icon">📚</div>
                  <h3>{t("noCoursesFound") || "No courses found"}</h3>
                  <p>{t("tryDifferentFilters") || "Try adjusting your search or filter criteria"}</p>
                </div>
              )}
            </div>

            {filteredCourses.length === 0 && courses.length > 0 && (
              <div className="no-courses">
                <div className="no-courses-icon">📚</div>
                <h3>{t("noCoursesFound") || "No courses found"}</h3>
                <p>{t("tryDifferentFilters") || "Try adjusting your search or filter criteria"}</p>
              </div>
            )}

            {courses.length === 0 && !loading && (
              <div className="no-courses">
                <div className="no-courses-icon">🎓</div>
                <h3>{t("noCoursesAvailable") || "No courses available yet"}</h3>
                <p>{t("checkBackLater") || "Please check back later for new courses"}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseGrid;