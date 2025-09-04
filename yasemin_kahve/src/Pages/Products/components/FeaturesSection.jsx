import React from 'react'
import { Award, Truck, Shield } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Award />,
      title: t("premiumBeans") || "Premium Quality",
      description: t("premiumBeansDesc") || "Hand-selected beans from the world's finest coffee regions"
    },
    {
      icon: <Truck />,
      title: "Fresh Delivery",
      description: "Direct from our farms and trusted suppliers to your doorstep"
    },
    {
      icon: <Shield />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all our coffee products"
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection