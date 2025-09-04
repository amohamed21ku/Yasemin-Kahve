import React from 'react'
import { MapPin, Phone, Mail, Clock, Truck } from 'lucide-react'
import './LocationsSection.css'

const LocationsSection = () => {
  return (
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
                <p><Phone size={16} /> +90 539 500 44 44</p>
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
                <p><Phone size={16} /> +90 539 500 44 44</p>
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
  )
}

export default LocationsSection