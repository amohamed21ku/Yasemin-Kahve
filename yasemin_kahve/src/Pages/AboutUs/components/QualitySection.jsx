import React from 'react'
import { Award, Coffee, Truck } from 'lucide-react'
import './QualitySection.css'

const QualitySection = () => {
  return (
    <section className="about-quality-unique">
      <div className="container-quality-unique">
        <h2>Farm to Cup Excellence</h2>
        <p className="quality-about-intro">
          Originating from our family-owned green coffee farms in Guatemala as well as globally 
          sourced coffee beans, we control every stage of production from farm to cup.
        </p>
        
        <div className="quality-features">
          <div className="quality-card">
            <Award className="quality-icon" />
            <h3>Century of Expertise</h3>
            <p>Over 100 years of traditional Turkish coffee wisdom combined with modern techniques</p>
          </div>
          
          <div className="quality-card">
            <Coffee className="quality-icon" />
            <h3>Family-Owned Farms</h3>
            <p>Direct sourcing from our own coffee farms in Guatemala ensuring quality control</p>
          </div>
          
          <div className="quality-card">
            <Truck className="quality-icon" />
            <h3>Global Distribution</h3>
            <p>Leading exporter of premium coffee and cardamom serving customers worldwide</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QualitySection