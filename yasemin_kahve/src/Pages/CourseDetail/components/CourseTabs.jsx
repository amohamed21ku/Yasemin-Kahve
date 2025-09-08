import React from 'react'
import './CourseTabs.css'

const CourseTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="course-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default CourseTabs