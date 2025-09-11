import React from 'react'
import { MapPin, Phone, Mail, Clock, Truck } from 'lucide-react'
import './LocationsSection.css'
import { useTranslation } from "/src/useTranslation";

const LocationsSection = () => {
    const { t } = useTranslation();
  
  return (
    <section className="about-locations">
      <div className="container">
        <h2>{t("ourLocations")}</h2>
        <div className="locations-grid">
          {/* Head Office */}
          <div className="location-card">
            <h3><MapPin className="location-icon" /> {t("headOfficeTitle")}</h3>
            <div className="location-info">
              <p><strong>Yasemin Kahve {t("headOfficeTitle")}</strong></p>
              <p>{t("headOfficeAddress1")}{t("headOfficeAddress2")} {t("headOfficeAddress3")}</p>


              <div className="contact-info">
                <p><Phone size={16} /> +90 539 500 44 44</p>
                <p><Mail size={16} /> info@yaseminkahve.com</p>
                <p><Clock size={16} /> Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="map-container">
              <a 
                href="https://www.google.com/maps/place/Yasemin+Kahve+Head+Office/@41.1199293,28.7720848,17z/data=!3m1!4b1!4m6!3m5!1s0x14caaf88faaef891:0xa91f9cc6db6d95e4!8m2!3d41.1199293!4d28.7746597!16s%2Fg%2F11rv80mm6p?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7766159779953!2d28.772084815725974!3d41.11992930846686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaf88faaef891%3A0xa91f9cc6db6d95e4!2sYasemin%20Kahve%20Head%20Office!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '12px', pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Head Office Location"
                ></iframe>
              </a>
            </div>
          </div>

          {/* Wholesale Center */}
          <div className="location-card">
            <h3><Truck className="location-icon" /> {t("wholesaleCenterTitle")}</h3>
            <div className="location-info">
              <p><strong>Yasemin Kahve {t("wholesaleCenterTitle")}</strong></p>
              <p>{t("wholesaleAddress1")} {t("wholesaleAddress2")} {t("wholesaleAddress3")} {t("wholesaleAddress4")}</p>
              <div className="contact-info">
                <p><Phone size={16} /> +90 539 500 44 44</p>
                <p><Mail size={16} /> wholesale@yaseminkahve.com</p>
                <p><Clock size={16} /> Mon-Fri: 8:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="map-container">
              <a 
                href="https://www.google.com/maps/place/Yasemin+Kahve+Deposu/@41.0833439,28.7155908,17z/data=!3m1!4b1!4m6!3m5!1s0x14caa76c3efcd521:0x420517cc992f29be!8m2!3d41.0833439!4d28.7181657!16s%2Fg%2F11rv8bgrmz?entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.2843717896387!2d28.71559081572527!3d41.08334390846164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa76c3efcd521%3A0x420517cc992f29be!2sYasemin%20Kahve%20Deposu!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: '12px', pointerEvents: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wholesale Center Location"
                ></iframe>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationsSection