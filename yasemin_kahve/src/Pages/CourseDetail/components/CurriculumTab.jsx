import React from 'react'
import { Clock, CheckCircle, FileText } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './TabContent.css'
import './CurriculumTab.css'

const CurriculumTab = ({ courseDetails, getLocalizedText, isEnrolled }) => {
  const { t } = useTranslate()
  if (!courseDetails.curriculum || courseDetails.curriculum.length === 0) {
    return null
  }

  return (
    <div className="tab-content">
      <h3>{t("courseCurriculum") || "Course Curriculum"}</h3>
      <div className="curriculum-overview">
        <p>{t("curriculumDescription") || "This course is structured into modules designed to provide you with comprehensive knowledge and practical skills."}</p>
      </div>
      <div className="curriculum-list">
        {courseDetails.curriculum.map((module, moduleIndex) => (
          <div key={module.id} className="curriculum-module">
            <div className="module-header">
              <div className="module-number">
                <span>{moduleIndex + 1}</span>
              </div>
              <div className="module-info">
                <h4>{getLocalizedText(module.title)}</h4>
                <div className="module-meta">
                  <span className="module-duration">
                    <Clock size={14} />
                    {module.duration} {t("hours") || "hours"}
                  </span>
                  {module.lessons && (
                    <span className="topic-count">
                      <FileText size={14} />
                      {module.lessons.length} {module.lessons.length === 1 ? (t("topic") || "topic") : (t("topics") || "topics")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {module.lessons && module.lessons.length > 0 && (
              <div className="module-content">
                <div className="topics-list">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="topic-item">
                      <div className="topic-icon">
                        <FileText size={16} />
                      </div>
                      <div className="topic-details">
                        <h5 className="topic-title">{getLocalizedText(lesson)}</h5>
                        {lesson.description && (
                          <p className="topic-description">{getLocalizedText(lesson.description)}</p>
                        )}
                      </div>
                      {isEnrolled && (
                        <div className="topic-status">
                          <CheckCircle size={16} className="completed" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CurriculumTab