// AboutContact.jsx (Enhanced version of existing contact)
import React, { useState } from "react";
import { Send, Phone, Mail, Clock, MapPin } from "lucide-react";

const AboutContact = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({ email: '', firstName: '', lastName: '', phone: '', message: '' });
  };

  return (
    <section className="about-contact">
      <div className="about-contact-background"></div>
      
      <div className="container">
        <div className="about-contact-header">
          <h2 className="about-contact-title">Let's Start a Conversation</h2>
          <p className="about-contact-description">
            Ready to transform your technology infrastructure? Get in touch with our experts today.
          </p>
        </div>

        <div className="about-contact-grid">
          <div className="about-contact-info">
            <div className="about-contact-cards">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail />
                </div>
                <div className="contact-info-content">
                  <h4 className="contact-info-title">Email Us</h4>
                  <p className="contact-info-detail">admin@multitech.com.sa</p>
                  <p className="contact-info-detail">info@multitech.com.sa</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone />
                </div>
                <div className="contact-info-content">
                  <h4 className="contact-info-title">Call Us</h4>
                  <p className="contact-info-detail">+966 5549 100 951</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Clock />
                </div>
                <div className="contact-info-content">
                  <h4 className="contact-info-title">Business Hours</h4>
                  <p className="contact-info-detail">Sun-Thu: 9:00 AM - 6:00 PM</p>
                  <p className="contact-info-detail">Fri-Sat: Closed</p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin />
                </div>
                <div className="contact-info-content">
                  <h4 className="contact-info-title">Location</h4>
                  <p className="contact-info-detail">Saudi Arabia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-contact-form-container">
            <h3 className="about-form-title">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="about-contact-form">
              <div className="about-form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="about-form-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="about-form-input"
                  required
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="about-form-input"
                required
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="about-form-input"
                required
              />
              
              <textarea
                name="message"
                placeholder="Tell us about your project or inquiry..."
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                className="about-form-textarea"
                required
              />
              
              <button type="submit" className="about-form-submit">
                <Send />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutContact;