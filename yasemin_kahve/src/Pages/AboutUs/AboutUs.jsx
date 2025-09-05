import React from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import AboutHero from './components/AboutHero'
import OurStory from './components/OurStory'
import QualitySection from './components/QualitySection'
import MissionSection from './components/MissionSection'
import LocationsSection from './components/LocationsSection'
import { useTranslation } from '../../useTranslation'
import './AboutUs.css'

const AboutUs = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="about-us-page">
      <Header activeSection="about" onNavigate={onNavigate} />
      <AboutHero />
      <OurStory />
      <QualitySection />
      <MissionSection />
      <LocationsSection />
      <Footer />
    </div>
  )
}

export default AboutUs