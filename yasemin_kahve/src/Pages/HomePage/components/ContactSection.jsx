// ContactSection.jsx with translations
import React, { useState } from "react";
import { Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslation } from "/src/useTranslation";
import { contactService } from "/src/services/contactService";

const ContactSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleWhatsAppClick = () => {
    const phoneNumber = '+905395004444';
    const message = encodeURIComponent('Hello! I would like to get information about your coffee products.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactService.submitMessage(formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        message: ''
      });
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" data-section="contact">
      <div className="container">
        <div className="contact-grid">
          <div>
            <h2 className="contact-title">{t("contactUs") || "Contact us"}</h2>
            <p className="contact-description">
              {t("contactUsDescription") || "Let's try out the irresistible green coffee… Let's partner and experience the success together…"}
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone />
                </div>
                <div>
                  <div className="contact-label">{t("callUs") || "Call Us"}</div>
                  <div className="contact-value">444 44 86</div>
                  <div className="contact-value">+90 539 500 44 44</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Mail />
                </div>
                <div>
                  <div className="contact-label">{t("emailUs") || "Email Us"}</div>
                  <div className="contact-value">Sales@yaseminkahve.com</div>
                </div>
              </div>

              <div 
                className="contact-item whatsapp-contact" 
                onClick={handleWhatsAppClick}
                style={{ cursor: 'pointer' }}
              >
                <div className="contact-icon whatsapp-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                   
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                </div>
                <div>
                  <div className="contact-label">WhatsApp Us</div>
                  <div className="contact-value" style={{ color: '#25D366', fontWeight: '600' }}>
                    {t("clickToChat") || "Click to chat"}
                  </div>
                  <div className="contact-value" style={{ fontSize: '0.85em', color: '#eaeaeaff' }}>
                    +90 539 500 44 44
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3 className="form-title">{t("sendMessage") || "Send us a message"}</h3>
            {submitStatus === 'success' && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                {t("messageSentSuccess") || "Message sent successfully! We'll get back to you soon."}
              </div>
            )}
            {submitStatus === 'error' && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                {t("messageSentError") || "Failed to send message. Please try again."}
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t("firstName") || "First Name"}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t("lastName") || "Last Name"}
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("emailAddress") || "Email Address"}
                className="form-input"
                required
                disabled={isSubmitting}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("phoneNumber") || "Phone Number"}
                className="form-input"
                required
                disabled={isSubmitting}
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder={t("company") || "Company (Optional)"}
                className="form-input"
                disabled={isSubmitting}
              />
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={isSubmitting}
              >
                <option value="">{t("selectInquiryType") || "Select Inquiry Type"}</option>
                <option value="wholesale">{t("wholesale") || "Wholesale Partnership"}</option>
                <option value="distribution">{t("distribution") || "Distribution Inquiry"}</option>
                <option value="product-info">{t("productInfo") || "Product Information"}</option>
                <option value="quality-questions">{t("qualityQuestions") || "Quality Questions"}</option>
                <option value="other">{t("other") || "Other"}</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("yourMessage") || "Your Message"}
                rows="4"
                className="form-textarea"
                required
                disabled={isSubmitting}
              />
              <button type="submit" className="form-submit" disabled={isSubmitting}>
                <Send />
                <span>{isSubmitting ? (t("sending") || "Sending...") : (t("sendMessage") || "Send Message")}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;