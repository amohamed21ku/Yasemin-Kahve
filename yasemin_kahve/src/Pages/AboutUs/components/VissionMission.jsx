
// VisionMission.jsx
import React from "react";
import { Eye, Target, Heart, Lightbulb } from "lucide-react";

const VisionMission = () => {
  const missionPoints = [
    {
      icon: <Heart />,
      title: "Strong Relationships",
      description: "We cultivate strong relationships with our customers based on trust, integrity, and mutual respect."
    },
    {
      icon: <Target />,
      title: "Tailored Solutions", 
      description: "We offer customized solutions aligned with each customer's unique requirements."
    },
    {
      icon: <Lightbulb />,
      title: "Added Value",
      description: "We add value to our customer's businesses through industry insights and process optimization guidance."
    }
  ];

  return (
    <section className="vision-mission">
      <div className="vision-mission-background"></div>
      
      <div className="container">
        <div className="vision-mission-content">
          <div className="vision-section">
            <div className="vision-card">
              <div className="vision-icon">
                <Eye />
              </div>
              <div className="vision-content">
                <h2 className="vision-title">Our Vision</h2>
                <p className="vision-text">
                  Becoming a trusted advisor and preferred solution provider for our customers, 
                  building strong relationships, demonstrating expertise, and consistently 
                  delivering value through innovative and sustainable solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="mission-section">
            <h3 className="mission-title">Our Mission</h3>
            <div className="mission-grid">
              {missionPoints.map((point, index) => (
                <div key={index} className="mission-card">
                  <div className="mission-card-icon">
                    {point.icon}
                  </div>
                  <div className="mission-card-content">
                    <h4 className="mission-card-title">{point.title}</h4>
                    <p className="mission-card-description">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default VisionMission;