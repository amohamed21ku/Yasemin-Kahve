import React from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { MapPin, Phone, Mail, Clock, Truck, Award } from 'lucide-react'
import { useTranslation } from '/src/useTranslation'
import './AboutUs.css'

const AboutUs = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="about-us-page">
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <h1>ROASTED TO PERFECTION…</h1>
            <p className="about-subtitle">Since 1921 - A Century of Coffee Excellence</p>
          </div>
          <div className="about-hero-image">
            <img src="/static/images/assets/bean.png" alt="Coffee Beans" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Journey</h2>
              <p>
                Founded in 1921 in Türkiye, our journey in the world of coffee has been remarkable.
                Carrying the wisdom of traditional Turkish coffee with us and now with a century of expertise, 
                we expanded our operations and established a powerful presence in Guatemala, becoming a name 
                synonymous with quality coffee and one of the world's leading exporters of cardamom over 
                many years in the field.
              </p>
              <p>
                Under the brand Yasemin Kahve, we returned to our roots in Türkiye, making our mark as one 
                of the country's premier coffee distributors. Our unique selling point is the authenticity 
                and quality of our coffee and cardamom along with years of expertise and experience.
              </p>
            </div>
            <div className="story-image">
              <img src="/static/images/assets/yasemin.png" alt="Yasemin Kahve Heritage" />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="about-quality">
        <div className="container">
          <h2>Farm to Cup Excellence</h2>
          <p className="quality-intro">
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

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              We are pleased to meet and continue to meet the needs of all coffee shops and roasteries, 
              as well as the growing demand from customers for the best coffees, along with wide varieties 
              of the best cardamom pods.
            </p>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="about-locations">
        <div className="container">
          <h2>Our Locations</h2>
          <div className="locations-grid">
            {/* Head Office */}
            <div className="location-card">
              <h3><MapPin className="location-icon" /> Head Office</h3>
              <div className="location-info">
                <p><strong>Yasemin Kahve Headquarters</strong></p>
                <p>Istanbul, Türkiye</p>
                <div className="contact-info">
                  <p><Phone size={16} /> +90 XXX XXX XXXX</p>
                  <p><Mail size={16} /> info@yaseminkahve.com</p>
                  <p><Clock size={16} /> Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2076928261!2d28.97953291572589!3d41.008610479301344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bd6570f4e1%3A0x8dc0b2c7784e7e6e!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Head Office Location"
                ></iframe>
              </div>
            </div>

            {/* Wholesale Center */}
            <div className="location-card">
              <h3><Truck className="location-icon" /> Wholesale Center</h3>
              <div className="location-info">
                <p><strong>Yasemin Kahve Distribution</strong></p>
                <p>Istanbul, Türkiye</p>
                <div className="contact-info">
                  <p><Phone size={16} /> +90 XXX XXX XXXX</p>
                  <p><Mail size={16} /> wholesale@yaseminkahve.com</p>
                  <p><Clock size={16} /> Mon-Fri: 8:00 AM - 7:00 PM</p>
                </div>
              </div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2076928261!2d28.97953291572589!3d41.008610479301344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9bd6570f4e1%3A0x8dc0b2c7784e7e6e!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wholesale Center Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs