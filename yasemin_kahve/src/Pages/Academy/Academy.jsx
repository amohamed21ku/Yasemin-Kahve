import React from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import './Academy.css'

const Academy = ({ onNavigate }) => {
  return (
    <div className="academy-page">
      <Header activeSection="academy" onNavigate={onNavigate} />
      <div className="academy-content">
        <h1>Yasemin Kahve Academy</h1>
        <p>Content coming soon...</p>
      </div>
      <Footer />
    </div>
  )
}

export default Academy