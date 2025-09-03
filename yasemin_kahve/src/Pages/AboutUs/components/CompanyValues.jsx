
// CompanyValues.jsx
import React, { useEffect, useState } from "react";
import { Sparkles, Shield, Users, Handshake, Leaf, TrendingUp, Zap } from "lucide-react";

const CompanyValues = () => {
  const [visibleValues, setVisibleValues] = useState([]);

  const values = [
    {
      icon: <Sparkles />,
      title: "Innovation",
      description: "We embrace technological advancements and creative solutions to drive progress.",
      color: "blue"
    },
    {
      icon: <Shield />,
      title: "Reliability", 
      description: "We are committed to providing consistent, dependable telecom services.",
      color: "green"
    },
    {
      icon: <Users />,
      title: "Customer-Centricity",
      description: "We prioritize the needs and satisfaction of our customers in everything we do.",
      color: "purple"
    },
    {
      icon: <Handshake />,
      title: "Integrity",
      description: "We conduct ourselves with honesty, ethics, and transparency in all business interactions.",
      color: "orange"
    },
    {
      icon: <Users />,
      title: "Collaboration",
      description: "We foster teamwork, diversity, and partnerships to achieve shared goals.",
      color: "cyan"
    },
    {
      icon: <Leaf />,
      title: "Sustainability",
      description: "We actively contribute to a sustainable and environmentally responsible future.",
      color: "emerald"
    },
    {
      icon: <TrendingUp />,
      title: "Continuous Improvement",
      description: "We continuously learn and adapt to deliver excellence in all our endeavors.",
      color: "indigo"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleValues(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.value-card').forEach((card, index) => {
      card.dataset.index = index;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="company-values">
      <div className="container">
        <div className="values-header">
          <div className="section-badge">Our Foundation</div>
          <h2 className="section-title text-center">
            Core <span className="text-highlight">Values</span> That Drive Us
          </h2>
          <p className="section-description text-center">
            These principles guide every decision we make and every solution we deliver
          </p>
        </div>

        <div className="values-grid">
          {values.map((value, index) => (
            <div 
              key={index} 
              className={`value-card ${value.color} ${visibleValues.includes(index) ? 'visible' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="value-card-inner">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
                <div className="value-card-glow"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CompanyValues;