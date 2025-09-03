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
            <div className="section-badge">{t("roastedToPerfection") || "ROASTED TO PERFECTION..."}</div>
            <h2 className="section-title">
              {t("yaseminKahveStory") || "Located in beautiful Turkey, where the core Turkish coffee is"}
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

            <button 
              className="btn-primary"
              onClick={() => onNavigate('products')}
            >
              <span>{t("exploreProducts") || "Explore Our Products"}</span>
              <ArrowRight />
            </button>
          </div>

          <div className="overview-visual">
            <div className="values-card">
              <div className="values-content">
                <div className="values-header">
                  <h3>{t("ourValues") || "Our Values"}</h3>
                  <p>{t("builtOnQuality") || "Built on quality and tradition since 1921"}</p>
                </div>

                <div className="values-list">
                  <div className="value-item quality">
                    <span className="value-name">{t("quality") || "Quality"}</span>
                    <div className="value-bar quality">
                      <div className="value-progress quality" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div className="value-item tradition">
                    <span className="value-name">{t("tradition") || "Tradition"}</span>
                    <div className="value-bar tradition">
                      <div className="value-progress tradition" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div className="value-item authenticity">
                    <span className="value-name">{t("authenticity") || "Authenticity"}</span>
                    <div className="value-bar authenticity">
                      <div className="value-progress authenticity" style={{width: '98%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-element floating-1"></div>
            <div className="floating-element floating-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;