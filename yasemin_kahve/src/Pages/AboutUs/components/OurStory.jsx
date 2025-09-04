import React from 'react'
import './OurStory.css'

const OurStory = () => {
  return (
    <section className="about-story">
      <div className="container">
        <div className="story-content">
          <div className="story-text">
            <h2>Our Journey</h2>
            <p>
              Founded in 1921 in Türkiye, our journey in the world of coffee has been remarkable.
              Carrying the wisdom of traditional Turkish coffee with us and now with a century of expertise, 
              we expanded our operations and established a powerful presence in Guatemala, becoming a name 
              synonymous with quality coffee and one of the world's leading exporters of cardamom over 
              many years in the field.
            </p>
            <p>
              Under the brand Yasemin Kahve, we returned to our roots in Türkiye, making our mark as one 
              of the country's premier coffee distributors. Our unique selling point is the authenticity 
              and quality of our coffee and cardamom along with years of expertise and experience.
            </p>
          </div>
          <div className="story-image">
            <img src="/static/images/assets/van.png" alt="Yasemin Kahve Heritage" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory