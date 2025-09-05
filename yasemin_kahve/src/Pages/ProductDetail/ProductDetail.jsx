import React from 'react'
import { Star, Coffee, ArrowLeft, Package, Globe, Award } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { useTranslation } from '../../useTranslation'
import './ProductDetail.css'

const ProductDetail = ({ onNavigate, product, previousPage }) => {
  const { t } = useTranslation();

  // Default product data if none provided
  const defaultProduct = {
    id: 1,
    name: "COLOMBIAN 18",
    origin: "Colombia",
    description: "Premium Colombian coffee with rich, smooth taste and balanced acidity. Sourced from high-altitude regions for exceptional quality.",
    detailedDescription: "This exceptional Colombian coffee represents the pinnacle of South American coffee craftsmanship. Grown at altitudes between 1,200-1,800 meters in the fertile volcanic soils of the Colombian Andes, our Colombian 18 offers a perfect balance of sweetness and acidity. The beans are carefully hand-picked at peak ripeness and processed using traditional washed methods that have been refined over generations. The result is a coffee with remarkable clarity, featuring bright citrus notes complemented by rich chocolate undertones and a silky smooth finish that lingers pleasantly on the palate.",
    image: "/static/images/assets/Products/Colombia/Colombiapng.png",
    category: "Colombian",
    price: "₺85.00",
    rating: 4.8,
    badge: "Premium",
    roastLevel: "Medium",
    processingMethod: "Washed",
    altitude: "1,200-1,800m",
    harvestSeason: "October - February",
    cupping: {
      aroma: 8.5,
      flavor: 8.8,
      acidity: 8.2,
      body: 8.0,
      balance: 8.6
    },
    tastingNotes: ["Chocolate", "Citrus", "Caramel", "Nutty"]
  };

  // Get detailed data from Firebase data or fallback to transformed data
  const getProductDetail = (product) => {
    if (!product) return defaultProduct;
    
    // If product has _firebaseData, use that for detailed information
    const firebaseData = product._firebaseData;
    if (firebaseData) {
      const currentLang = localStorage.getItem('language') || 'en';
      return {
        ...product, // Use the transformed frontend data as base
        detailedDescription: firebaseData.detailedDescription?.[currentLang] || 
                           firebaseData.detailedDescription?.en || 
                           firebaseData.detailedDescription?.tr || 
                           product.description,
        roastLevel: firebaseData.roastLevel,
        processingMethod: firebaseData.processingMethod,
        altitude: firebaseData.altitude,
        harvestSeason: firebaseData.harvestSeason,
        cupping: firebaseData.cupping,
        tastingNotes: firebaseData.tastingNotes || []
      };
    }
    
    return product;
  };

  const displayProduct = getProductDetail(product);

  const getCountryFlag = (origin) => {
    const flagCodeMap = {
      'Colombia': 'co',
      'India': 'in', 
      'Brazil': 'br',
      'Kenya': 'ke',
      'Nicaragua': 'ni',
      'Guatemala': 'gt',
      'Turkey': 'tr',
      'Ethiopia': 'et'
    };
    const flagCode = flagCodeMap[origin];
    
    if (flagCode) {
      return <span className={`fi fi-${flagCode}`} style={{ fontSize: '1.2em' }}></span>;
    }
    return <span style={{ fontSize: '1.2em' }}>🌍</span>;
  };

  const handleBackClick = () => {
    if (onNavigate) {
      // If user came from homepage, go back to homepage
      // Otherwise, go to products page
      const targetPage = previousPage === 'home' ? 'home' : 'products';
      onNavigate(targetPage);
    }
  };

  return (
    <div className="product-detail-page">
      <Header activeSection="products" onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="product-detail-hero">
        <div className="productdetail-container">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={20} />
            <span>{previousPage === 'home' ? 'Back to Home' : 'Back to Products'}</span>
          </button>
          
          <div className="product-detail-content">
            <div className="product-image-section">
              <div className="product-image-container">
                <img
                  src={displayProduct.image}
                  alt={displayProduct.name}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='200' cy='160' r='30'/%3E%3Cellipse cx='200' cy='240' rx='50' ry='30'/%3E%3C/g%3E%3Ctext x='200' y='320' text-anchor='middle' fill='%23503c2b' font-size='24'%3ECoffee%3C/text%3E%3C/svg%3E";
                  }}
                />
                {displayProduct.badge && (
                  <div className="productdetail-product-badge">{displayProduct.badge}</div>
                )}
              </div>
            </div>
            
            <div className="product-info-section">
              <div className="product-header">
                <div className="product-origin">
                  <span className="country-flag">{getCountryFlag(displayProduct.origin)}</span>
                  <span>{displayProduct.origin}</span>
                </div>
                
                {displayProduct.rating && (
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          fill={i < Math.floor(displayProduct.rating) ? "#e6b555" : "none"}
                          color="#e6b555"
                        />
                      ))}
                    </div>
                    <span className="rating-number">({displayProduct.rating})</span>
                  </div>
                )}
              </div>
                              <h1 className="product-title">{displayProduct.name}</h1>

              
              <div className="product-description">
                <p>{displayProduct.detailedDescription || displayProduct.description}</p>
              </div>
              
              <div className="product-specifications">
                <h3>Product Specifications</h3>
                <div className="specs-grid">
                  {displayProduct.roastLevel && (
                    <div className="spec-item">
                      <Coffee size={18} />
                      <div>
                        <span className="spec-label">Roast Level</span>
                        <span className="spec-value">{displayProduct.roastLevel}</span>
                      </div>
                    </div>
                  )}
                  
                  {displayProduct.processingMethod && (
                    <div className="spec-item">
                      <Package size={18} />
                      <div>
                        <span className="spec-label">Processing</span>
                        <span className="spec-value">{displayProduct.processingMethod}</span>
                      </div>
                    </div>
                  )}
                  
                  {displayProduct.altitude && (
                    <div className="spec-item">
                      <Globe size={18} />
                      <div>
                        <span className="spec-label">Altitude</span>
                        <span className="spec-value">{displayProduct.altitude}</span>
                      </div>
                    </div>
                  )}
                  
                  {displayProduct.harvestSeason && (
                    <div className="spec-item">
                      <Award size={18} />
                      <div>
                        <span className="spec-label">Harvest Season</span>
                        <span className="spec-value">{displayProduct.harvestSeason}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {displayProduct.tastingNotes && (
                <div className="tasting-notes">
                  <h3>Tasting Notes</h3>
                  <div className="notes-list">
                    {displayProduct.tastingNotes.map((note, index) => (
                      <span key={index} className="note-tag">{note}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="product-actions">
                {displayProduct.price && (
                  <div className="price-section">
                    <span className="price">{displayProduct.price}</span>
                    <span className="price-unit">per kg</span>
                  </div>
                )}
                <button className="contact-button">
                  Contact for Wholesale
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {displayProduct.cupping && (
        <section className="cupping-scores">
          <div className="productdetail-container">
            <h2>Cupping Scores</h2>
            <div className="scores-grid">
              <div className="score-item">
                <span className="score-label">Aroma</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${displayProduct.cupping.aroma * 10}%`}}></div>
                </div>
                <span className="score-value">{displayProduct.cupping.aroma}</span>
              </div>
              
              <div className="score-item">
                <span className="score-label">Flavor</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${displayProduct.cupping.flavor * 10}%`}}></div>
                </div>
                <span className="score-value">{displayProduct.cupping.flavor}</span>
              </div>
              
              <div className="score-item">
                <span className="score-label">Acidity</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${displayProduct.cupping.acidity * 10}%`}}></div>
                </div>
                <span className="score-value">{displayProduct.cupping.acidity}</span>
              </div>
              
              <div className="score-item">
                <span className="score-label">Body</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${displayProduct.cupping.body * 10}%`}}></div>
                </div>
                <span className="score-value">{displayProduct.cupping.body}</span>
              </div>
              
              <div className="score-item">
                <span className="score-label">Balance</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${displayProduct.cupping.balance * 10}%`}}></div>
                </div>
                <span className="score-value">{displayProduct.cupping.balance}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default ProductDetail