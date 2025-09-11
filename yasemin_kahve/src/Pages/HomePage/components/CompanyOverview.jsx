import React from "react";
import { Coffee, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { useTranslation } from "/src/useTranslation";

const CompanyOverview = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <section className="company-overview">
      <div className="container">
        <div className="overview-grid">
          <div className="overview-content">
            <div className="section-badge">{t("OurStory") }</div>
            <h2 className="section-home-title">
              {t("HomePageTitle") }
            </h2>
            <p className="section-description">
              {t("yaseminKahveDescription") || "Yasemin Kahve was born in Guatemala to take the next step to Turkey. Nowadays, Yasemin Kahve is one of the biggest Turkish Coffee exporter for many distributors and perfect coffee shops in many countries around the world."}
            </p>
            <p className="section-description">
              {t("yaseminKahveStory2") || "Since Yasemin Kahve's initiation, we're getting our coffee beans from our family-owned green coffee farms in Guatemala, in addition to worldwide coffee beans."}
            </p>
            <p className="section-description">
              {t("yaseminKahveStory3") || "We have simply expanded to meet coffee shops and restaurants' changing needs, as well as customer's growing interest in the best coffees with high-quality cardamom."}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Coffee />
              </div>
              <div>
                <h4 className="feature-title">{t("premiumBeans") || "Premium Green Coffee Beans"}</h4>
                <p className="feature-description">{t("premiumBeansDesc") || "From our family-owned farms in Guatemala to worldwide coffee beans"}</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <MapPin />
              </div>
              <div>
                <h4 className="feature-title">{t("turkishOrigin") || "Turkish Coffee Heritage"}</h4>
                <p className="feature-description">{t("turkishOriginDesc") || "Born in Guatemala, perfected in Turkey since 1921"}</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Users />
              </div>
              <div>
                <h4 className="feature-title">{t("globalReach") || "Global Distribution"}</h4>
                <p className="feature-description">{t("globalReachDesc") || "Serving distributors and coffee shops worldwide"}</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Trophy />
              </div>
              <div>
                <h4 className="feature-title">{t("qualityCardamom") || "High-Quality Cardamom"}</h4>
                <p className="feature-description">{t("qualityCardamomDesc") || "Rich, fresh cardamom that enriches your recipes"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;