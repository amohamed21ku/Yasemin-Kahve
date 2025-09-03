// ContactSection.jsx with translations
import React from "react";
import { Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslation } from "/src/useTranslation";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section className="contact-section">
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
            </div>
          </div>

          <div className="contact-form-container">
            <h3 className="form-title">{t("sendMessage") || "Send us a message"}</h3>
            <form className="contact-form">
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder={t("firstName") || "First Name"} 
                  className="form-input" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder={t("lastName") || "Last Name"} 
                  className="form-input" 
                  required 
                />
              </div>
              <input 
                type="email" 
                placeholder={t("emailAddress") || "Email Address"} 
                className="form-input" 
                required 
              />
              <input 
                type="tel" 
                placeholder={t("phoneNumber") || "Phone Number"} 
                className="form-input" 
                required 
              />
              <input 
                type="text" 
                placeholder={t("company") || "Company (Optional)"} 
                className="form-input" 
              />
              <select className="form-input" required>
                <option value="">{t("selectInquiryType") || "Select Inquiry Type"}</option>
                <option value="wholesale">{t("wholesale") || "Wholesale Partnership"}</option>
                <option value="distribution">{t("distribution") || "Distribution Inquiry"}</option>
                <option value="product-info">{t("productInfo") || "Product Information"}</option>
                <option value="quality-questions">{t("qualityQuestions") || "Quality Questions"}</option>
                <option value="other">{t("other") || "Other"}</option>
              </select>
              <textarea 
                placeholder={t("yourMessage") || "Your Message"} 
                rows="4" 
                className="form-textarea" 
                required 
              />
              <button type="submit" className="form-submit">
                <Send />
                <span>{t("sendMessage") || "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;