// Footer.jsx with updated social media links and branding
import React from "react";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin } from "lucide-react";
import { useTranslation } from "/src/useTranslation";

// TikTok icon component since it's not in Lucide React
const TikTokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.349-2.019-1.349-3.338h-3.064v13.59c0 2.59-2.1 4.69-4.69 4.69-2.59 0-4.69-2.1-4.69-4.69s2.1-4.69 4.69-4.69c.423 0 .835.056 1.229.162V6.996c-.384-.054-.774-.082-1.169-.082C4.178 6.914 0 11.092 0 16.312s4.178 9.398 9.398 9.398 9.398-4.178 9.398-9.398V9.849a9.158 9.158 0 0 0 5.204 1.615v-3.064c-1.488 0-2.874-.637-3.835-1.676l-.844-1.162z"/>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-company">
            <div className="footer-logo">
              <img 
                src="/src/assets/yasemin.png"
                alt="Yasemin Kahve Logo" 
                className="footer-logo-img" 
                onError={(e) => {
                  // Hide image if it fails to load
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <span className="footer-company-name">Yasemin Kahve</span>
                <div className="footer-company-tagline">{t("since1921") || "Since 1921"}</div>
              </div>
            </div>
            <p className="footer-description">
              {t("footerDescription") || "Turkish coffee exporter and premium green coffee bean supplier. From Guatemala to Turkey, serving distributors and coffee shops worldwide with authentic Turkish coffee and high-quality cardamom."}
            </p>

            <div className="social-links">
              <a 
                href="https://www.facebook.com/yaseminkahve" 
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link facebook"
                aria-label="Facebook social link"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com/Yasemin_Kahve" 
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link instagram"
                aria-label="Instagram social link"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/yasemin-kahve" 
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link linkedin"
                aria-label="LinkedIn social link"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@yasemin.kahve.tr" 
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link tiktok"
                aria-label="TikTok social link"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">{t("headOffice") || "Head Office"}</h4>
            <div className="footer-location">
              <div className="footer-contact-item">
                <MapPin size={16} />
                <div>
                  <p>Kayabaşı Mah. Adnan Menders Blv.</p>
                  <p>Kuzey Yakası Sit, B5, No. 5D, İç Kapı</p>
                  <p>No. 44, Başakşehir / İstanbul – Türkiye</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer-title">{t("wholesale") || "Wholesale"}</h4>
            <div className="footer-location">
              <div className="footer-contact-item">
                <MapPin size={16} />
                <div>
                  <p>Şahintepe Mah, Şehit Polis Fethi Sekin Cad,</p>
                  <p>İstanbul Gıda Toptancılar Çarşısı,</p>
                  <p>Dış Kapı: 1AE, İç Kapı: z15, NO. 12B15,</p>
                  <p>Başakşehir / İstanbul – Türkiye</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Yasemin Kahve. {t("allRightsReserved") || "All rights reserved"} </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;