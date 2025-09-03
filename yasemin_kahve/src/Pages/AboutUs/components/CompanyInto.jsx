
// CompanyIntroduction.jsx
import React from "react";
import { Target, CheckCircle, Globe, Shield } from "lucide-react";

const CompanyIntroduction = () => {
  const highlights = [
    {
      icon: <Shield />,
      title: "Licensed & Certified",
      description: "Chamber of Commerce licensed with ISO certifications"
    },
    {
      icon: <Target />,
      title: "State-of-the-Art Solutions",
      description: "Cutting-edge technology and cost-effective implementations"
    },
    {
      icon: <Globe />,
      title: "Market Leadership",
      description: "Significant market share in IT and Telecom sector"
    },
    {
      icon: <CheckCircle />,
      title: "Proven Track Record",
      description: "Successfully designed and implemented complex projects"
    }
  ];

  return (
    <section className="company-introduction">
      <div className="container">
        <div className="introduction-grid">
          <div className="introduction-content">
            <div className="section-badge">Our Story</div>
            <h2 className="section-title">
              Pioneering <span className="text-highlight">Technology Excellence</span> in Saudi Arabia
            </h2>
            
            <div className="introduction-text">
              <p className="intro-paragraph">
                Multi Technology Company (Multitech) is a leading Telecommunications and IT company 
                in Saudi Arabia. Established in 2004 and licensed by the Chamber of Commerce, we offer 
                cutting-edge solutions and services with a highly skilled team of engineers and technicians.
              </p>
              
              <p className="intro-paragraph">
                Multitech is dedicated to delivering cost-effective and state-of-the-art technology 
                solutions. For decades, we have successfully designed and implemented complex projects 
                and continue to expand our services. Multi-Tech has achieved significant market share 
                in the IT and Telecom sector, reflecting our unwavering commitment to excellence.
              </p>
            </div>

            <div className="introduction-highlights">
              {highlights.map((highlight, index) => (
                <div key={index} className="intro-highlight">
                  <div className="intro-highlight-icon">
                    {highlight.icon}
                  </div>
                  <div className="intro-highlight-content">
                    <h4 className="intro-highlight-title">{highlight.title}</h4>
                    <p className="intro-highlight-description">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="introduction-visual">
            <div className="introduction-image-container">
              <div className="floating-card card-1">
                <div className="card-content">
                  <h4>Innovation</h4>
                  <p>Driving technological advancement</p>
                </div>
              </div>
              
              <div className="main-image">
                <img 
                  src="/src/assets/group_photo.png" 
                  alt="group_photo"
                  className="intro-main-image"
                />
              </div>
              
              <div className="floating-card card-2">
                <div className="card-content">
                  <h4>Excellence</h4>
                  <p>Commitment to quality service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CompanyIntroduction;