import React from 'react'

const EducationCTA = ({ onNavigate }) => {
  return (
    <section className="education-cta">
      <div className="container">
        <div className="cta-content">
          <h2>Learn the Art of Coffee</h2>
          <p>
            Master the techniques to brew the perfect cup with our coffee courses. 
            From basic brewing to advanced barista skills.
          </p>
          <button 
            className="cta-button"
            onClick={() => onNavigate && onNavigate('academy')}
          >
            Explore Our Academy
          </button>
        </div>
      </div>
    </section>
  )
}

export default EducationCTA