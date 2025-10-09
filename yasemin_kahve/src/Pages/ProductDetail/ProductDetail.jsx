import React, { useState, useEffect, useRef } from 'react'
import { Star, Coffee, ArrowLeft, Package, Globe, Award, ChevronLeft, ChevronRight, X, ShoppingCart, Zap, Settings, Palette } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { useTranslation } from '../../useTranslation'
import { getCountryFlagCode } from '../../utils/countryFlags'
import { PRODUCT_TYPES } from '../../services/productService'
import './ProductDetail.css'

const ProductDetail = ({ onNavigate, product, previousPage }) => {
  const { t, language } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showSampleSuccess, setShowSampleSuccess] = useState(false);
  const scoreRef = useRef(null);
  const cuppingRef = useRef(null);

  // Scroll to top BEFORE component renders
  useEffect(() => {
    // Immediately scroll to top with no smooth behavior
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Also set it again after a tiny delay to ensure it sticks
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [product]); // Re-run when product changes

  useEffect(() => {

    const handleScroll = () => {
      if (!scoreRef.current || !cuppingRef.current) return;

      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const cuppingTop = cuppingRef.current.offsetTop;

      // Start animation immediately when scrolling, complete much earlier
      const startPoint = 50; // Start after just 50px of scroll
      const endPoint = cuppingTop - windowHeight * 0.8; // End when cupping section is still 80% away from viewport

      const progress = Math.min(Math.max((scrollTop - startPoint) / (endPoint - startPoint), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    score: 88,
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

  // Helper function to get localized name
  const getLocalizedName = (product) => {
    if (product.name && typeof product.name === 'object') {
      return product.name[language] || product.name.en || product.name.tr || 'Unknown Product';
    }
    return product.name || 'Unknown Product';
  };

  // Helper function to get localized description
  const getLocalizedDescription = (product) => {
    if (product.description && typeof product.description === 'object') {
      return product.description[language] || product.description.en || product.description.tr || '';
    }
    return product.description || '';
  };

  // Get detailed data from Firebase data or fallback to transformed data
  const getProductDetail = (product) => {
    if (!product) return defaultProduct;
    
    // If product has _firebaseData, use that for detailed information
    const firebaseData = product._firebaseData;
    if (firebaseData) {
      return {
        ...product, // Use the transformed frontend data as base
        name: getLocalizedName(product),
        description: getLocalizedDescription(product),
        detailedDescription: firebaseData.detailedDescription?.[language] || 
                           firebaseData.detailedDescription?.en || 
                           firebaseData.detailedDescription?.tr || 
                           getLocalizedDescription(product),
        region: firebaseData.region,
        classification: firebaseData.classification,
        processing: firebaseData.processing,
        type: firebaseData.type,
        altitude: firebaseData.altitude,
        bagType: firebaseData.bagType,
        bagSize: firebaseData.bagSize,
        brewingMethods: firebaseData.brewingMethods || [],
        score: firebaseData.score,
        cupping: firebaseData.cupping,
        tastingNotes: firebaseData.tastingNotes || []
      };
    }
    
    // For fallback products, ensure name and description are strings
    return {
      ...product,
      name: getLocalizedName(product),
      description: getLocalizedDescription(product)
    };
  };

  const displayProduct = getProductDetail(product);

  // Get all product images
  const productImages = displayProduct.images || (displayProduct.image ? [displayProduct.image] : []);
  const hasMultipleImages = productImages.length > 1;

  // Helper function to get currency symbol
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'TRY':
      default:
        return '₺';
    }
  };

  // Helper function to format price with currency
  const formatPrice = (price, currency) => {
    if (!price) return null;
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const openImageModal = (index = currentImageIndex) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const getCountryFlag = (origin) => {
    const flagCode = getCountryFlagCode(origin);

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

  const addToSampleCart = () => {
    // Get existing sample cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('sampleCart') || '[]');

    // Check if product is already in cart
    const existingItem = existingCart.find(item => item.id === displayProduct.id);

    if (existingItem) {
      // Product already in sample cart
      setShowSampleSuccess(true);
      setTimeout(() => setShowSampleSuccess(false), 3000);
      return;
    }

    // Add product to sample cart
    const sampleItem = {
      id: displayProduct.id,
      name: displayProduct.name,
      image: displayProduct.image || displayProduct.images?.[0],
      origin: displayProduct.origin,
      region: displayProduct.region,
      addedAt: new Date().toISOString()
    };

    existingCart.push(sampleItem);
    localStorage.setItem('sampleCart', JSON.stringify(existingCart));

    // Show success message
    setShowSampleSuccess(true);
    setTimeout(() => setShowSampleSuccess(false), 3000);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('sampleCartUpdated'));
  };

  return (
    <div className="product-detail-page">
      <Header activeSection="products" onNavigate={onNavigate} darkContent={true} />
      
      {/* Hero Section */}
      <section className="product-detail-hero">
        {/* Score positioned absolutely on the right */}
        {displayProduct.score !== null && displayProduct.score !== undefined && (
          <div 
            ref={scoreRef}
            className="product-score-animated"
            style={{
              transform: `
                translate3d(
                  ${scrollProgress * -300}px,
                  ${scrollProgress * 400}px,
                  ${scrollProgress * 50}px
                )
                rotateY(${scrollProgress * 360}deg)
                rotateX(${scrollProgress * 15}deg)
                scale(${1 - scrollProgress * 0.3})
              `,
              opacity: scrollProgress > 0.75 ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <div className="score-number">{displayProduct.score}</div>
          </div>
        )}
        
        <div className="productdetail-container">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={20} />
            <span>{previousPage === 'home' ? 'Back to Home' : 'Back to Products'}</span>
          </button>
          
          <div className="product-detail-content">
            <div className="product-image-section">
              <div className="product-image-container">
                {productImages.length > 0 ? (
                  <>
                    <img
                      src={productImages[currentImageIndex]}
                      alt={`${displayProduct.name} - Image ${currentImageIndex + 1}`}
                      onClick={() => openImageModal(currentImageIndex)}
                      style={{ cursor: productImages.length > 1 ? 'pointer' : 'default' }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='200' cy='160' r='30'/%3E%3Cellipse cx='200' cy='240' rx='50' ry='30'/%3E%3C/g%3E%3Ctext x='200' y='320' text-anchor='middle' fill='%23503c2b' font-size='24'%3ECoffee%3C/text%3E%3C/svg%3E";
                      }}
                    />

                    {hasMultipleImages && (
                      <>
                        <button
                          className="productdetail-image-nav-btn prev-btn"
                          onClick={prevImage}
                          title="Previous image"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="productdetail-image-nav-btn next-btn"
                          onClick={nextImage}
                          title="Next image"
                        >
                          <ChevronRight size={20} />
                        </button>

                        <div className="productdetail-image-counter">
                          {currentImageIndex + 1} / {productImages.length}
                        </div>
                      </>
                    )}

                    {displayProduct.badge && (
                      <div className="productdetail-product-badge">{displayProduct.badge}</div>
                    )}
                  </>
                ) : (
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='200' cy='160' r='30'/%3E%3Cellipse cx='200' cy='240' rx='50' ry='30'/%3E%3C/g%3E%3Ctext x='200' y='320' text-anchor='middle' fill='%23503c2b' font-size='24'%3ECoffee%3C/text%3E%3C/svg%3E"
                    alt={displayProduct.name}
                  />
                )}
              </div>

              {/* Image Thumbnails */}
              {hasMultipleImages && (
                <div className="image-thumbnails">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      title={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${displayProduct.name} thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='40' cy='32' r='6'/%3E%3Cellipse cx='40' cy='48' rx='10' ry='6'/%3E%3C/g%3E%3C/svg%3E";
                        }}
                      />
                      {index === 0 && (
                        <div className="primary-label">
                          {t('primary') || 'Primary'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="product-info-section">
              <div className="product-header">
                <div className="product-origin-row">
                  <div className="product-origin">
                    <span className="country-flag">{getCountryFlag(displayProduct.origin)}</span>
                    <span>{displayProduct.origin}</span>
                  </div>
                  {displayProduct.score !== null && displayProduct.score !== undefined && (
                    <div className="mobile-score-inline">
                      <div className="mobile-score-number">{displayProduct.score}</div>
                    </div>
                  )}
                </div>
              </div>
              <h1 className="product-title">{displayProduct.name}</h1>

              
              <div className="product-description">
                <p>{displayProduct.detailedDescription || displayProduct.description}</p>
              </div>
              
              <div className="product-specifications">
                <h3>{t('productSpecifications') || 'Product Specifications'}</h3>
                <div className="specs-grid specs-grid-2x3">
                  {/* Coffee product specifications */}
                  {(!displayProduct.productType || displayProduct.productType === PRODUCT_TYPES.COFFEE) && (
                    <>
                      {displayProduct.region && (
                        <div className="spec-item">
                          <Coffee size={18} />
                          <div>
                            <span className="spec-label">{t('region') || 'Region'}</span>
                            <span className="spec-value">{displayProduct.region}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.classification && (
                        <div className="spec-item">
                          <Award size={18} />
                          <div>
                            <span className="spec-label">{t('classification') || 'Classification'}</span>
                            <span className="spec-value">{displayProduct.classification}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.processing && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('processing') || 'Processing'}</span>
                            <span className="spec-value">{displayProduct.processing}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.type && (
                        <div className="spec-item">
                          <Coffee size={18} />
                          <div>
                            <span className="spec-label">{t('type') || 'Type'}</span>
                            <span className="spec-value">{displayProduct.type}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.altitude && (
                        <div className="spec-item">
                          <Globe size={18} />
                          <div>
                            <span className="spec-label">{t('altitude') || 'Altitude'}</span>
                            <span className="spec-value">{displayProduct.altitude}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.bagType && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('bagType') || 'Bag Type'}</span>
                            <span className="spec-value">{displayProduct.bagType}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.bagSize && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('bagSize') || 'Bag Size'}</span>
                            <span className="spec-value">{displayProduct.bagSize} kg</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Coffee Machine specifications */}
                  {displayProduct.productType === PRODUCT_TYPES.MACHINE && (
                    <>
                      {displayProduct.brand && (
                        <div className="spec-item">
                          <Award size={18} />
                          <div>
                            <span className="spec-label">{t('brand') || 'Brand'}</span>
                            <span className="spec-value">{displayProduct.brand}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.model && (
                        <div className="spec-item">
                          <Settings size={18} />
                          <div>
                            <span className="spec-label">{t('model') || 'Model'}</span>
                            <span className="spec-value">{displayProduct.model}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.powerWattage && (
                        <div className="spec-item">
                          <Zap size={18} />
                          <div>
                            <span className="spec-label">{t('powerWattage') || 'Power'}</span>
                            <span className="spec-value">{displayProduct.powerWattage}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.voltage && (
                        <div className="spec-item">
                          <Zap size={18} />
                          <div>
                            <span className="spec-label">{t('voltage') || 'Voltage'}</span>
                            <span className="spec-value">{displayProduct.voltage}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.capacity && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('capacity') || 'Capacity'}</span>
                            <span className="spec-value">{displayProduct.capacity}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.dimensions && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('dimensions') || 'Dimensions'}</span>
                            <span className="spec-value">{displayProduct.dimensions}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.weight && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('weight') || 'Weight'}</span>
                            <span className="spec-value">{displayProduct.weight}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.warrantyPeriod && (
                        <div className="spec-item">
                          <Award size={18} />
                          <div>
                            <span className="spec-label">{t('warrantyPeriod') || 'Warranty'}</span>
                            <span className="spec-value">{displayProduct.warrantyPeriod}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Cardamom specifications */}
                  {displayProduct.productType === PRODUCT_TYPES.CARDAMOM && (
                    <>
                      {displayProduct.grade && (
                        <div className="spec-item">
                          <Award size={18} />
                          <div>
                            <span className="spec-label">{t('grade') || 'Grade'}</span>
                            <span className="spec-value">{displayProduct.grade}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.size && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('size') || 'Size'}</span>
                            <span className="spec-value">{displayProduct.size}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.color && (
                        <div className="spec-item">
                          <Palette size={18} />
                          <div>
                            <span className="spec-label">{t('color') || 'Color'}</span>
                            <span className="spec-value">{displayProduct.color}</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.moisture && (
                        <div className="spec-item">
                          <Globe size={18} />
                          <div>
                            <span className="spec-label">{t('moisture') || 'Moisture Content'}</span>
                            <span className="spec-value">{displayProduct.moisture}%</span>
                          </div>
                        </div>
                      )}

                      {displayProduct.packagingType && (
                        <div className="spec-item">
                          <Package size={18} />
                          <div>
                            <span className="spec-label">{t('packagingType') || 'Packaging'}</span>
                            <span className="spec-value">{displayProduct.packagingType}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Machine Features for Coffee Machines */}
              {displayProduct.productType === PRODUCT_TYPES.MACHINE && displayProduct.features && displayProduct.features.length > 0 && (
                <div className="machine-features">
                  <h3>{t('machineFeatures') || 'Machine Features'}</h3>
                  <div className="features-list">
                    {displayProduct.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              )}

              {displayProduct.tastingNotes && displayProduct.tastingNotes.length > 0 && (
                <div className="tasting-notes">
                  <h3>{t('tastingNotes') || 'Tasting Notes'}</h3>
                  <div className="notes-list">
                    {displayProduct.tastingNotes.map((note, index) => (
                      <span key={index} className="note-tag">{note}</span>
                    ))}
                  </div>
                </div>
              )}

              {displayProduct.brewingMethods && displayProduct.brewingMethods.length > 0 && (
                <div className="brewing-methods">
                  <h3 className="brewing-methods-title">Best for use in</h3>
                  <div className="brewing-methods-grid">
                    {displayProduct.brewingMethods.map((method, index) => {
                      const methodConfig = {
                        'espresso': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <circle cx="50" cy="35" r="25" fill="#5a4104ff"/>
                              <rect x="35" y="55" width="30" height="15" rx="5" fill="#f5d991ff"/>
                              <rect x="25" y="70" width="50" height="8" rx="4" fill="#eabf40ff"/>
                            </svg>
                          ),
                          label: 'Espresso'
                        },
                        'moka': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <polygon points="30,20 70,20 65,40 35,40" fill="#5a4104ff"/>
                              <rect x="25" y="40" width="50" height="30" fill="#f5d991ff"/>
                              <polygon points="35,70 65,70 60,85 40,85" fill="#eabf40ff"/>
                            </svg>
                          ),
                          label: 'Moka'
                        },
                        'cappuccino': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <circle cx="50" cy="45" r="30" fill="#5a4104ff"/>
                              <rect x="30" y="65" width="40" height="10" rx="5" fill="#f5d991ff"/>
                              <circle cx="50" cy="35" r="15" fill="#eabf40ff" opacity="0.3"/>
                            </svg>
                          ),
                          label: 'Cappuccino'
                        },
                        'french-press': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <rect x="30" y="35" width="40" height="45" rx="8" fill="#5a4104ff"/>
                              <circle cx="50" cy="25" r="8" fill="#f5d991ff"/>
                              <line x1="50" y1="15" x2="50" y2="65" stroke="#eabf40ff" strokeWidth="3"/>
                            </svg>
                          ),
                          label: 'French Press'
                        },
                        'pour-over': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <polygon points="35,25 65,25 55,55 45,55" fill="#5a4104ff"/>
                              <circle cx="50" cy="65" r="20" fill="#f5d991ff"/>
                              <circle cx="50" cy="35" r="8" fill="#eabf40ff" opacity="0.3"/>
                            </svg>
                          ),
                          label: 'Pour Over'
                        },
                        'drip': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <rect x="25" y="40" width="50" height="35" rx="10" fill="#5a4104ff"/>
                              <rect x="20" y="30" width="60" height="15" rx="7" fill="#f5d991ff"/>
                              <circle cx="40" cy="20" r="3" fill="#eabf40ff"/>
                              <circle cx="50" cy="15" r="3" fill="#eabf40ff"/>
                              <circle cx="60" cy="20" r="3" fill="#eabf40ff"/>
                            </svg>
                          ),
                          label: 'Drip Coffee'
                        },
                        'cold-brew': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <rect x="35" y="25" width="30" height="50" rx="15" fill="#5a4104ff"/>
                              <circle cx="45" cy="35" r="3" fill="#87CEEB"/>
                              <circle cx="55" cy="40" r="3" fill="#87CEEB"/>
                              <circle cx="50" cy="50" r="3" fill="#87CEEB"/>
                            </svg>
                          ),
                          label: 'Cold Brew'
                        },
                        'turkish': {
                          icon: (
                            <svg viewBox="0 0 100 100" className="brewing-icon">
                              <polygon points="40,30 60,30 65,70 35,70" fill="#5a4104ff"/>
                              <rect x="60" y="45" width="20" height="4" fill="#5a4104ff"/>
                              <circle cx="50" cy="25" r="5" fill="#f5d991ff"/>
                            </svg>
                          ),
                          label: 'Turkish Coffee'
                        }
                      };

                      const config = methodConfig[method] || {
                        icon: (
                          <svg viewBox="0 0 100 100" className="brewing-icon">
                            <circle cx="50" cy="50" r="30" fill="#FFD700"/>
                          </svg>
                        ),
                        label: method
                      };

                      return (
                        <div key={index} className="brewing-method-column">
                          <div className="brewing-method-icon">
                            {config.icon}
                          </div>
                          <div className="brewing-method-label">{config.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="product-actions">
                {displayProduct.price && displayProduct.price !== null && displayProduct.price.toString().trim() !== '' && (
                  <div className="price-section">
                    <span className="price">{formatPrice(displayProduct.price, displayProduct.currency) || displayProduct.price}</span>
                    <span className="price-unit">per kg</span>
                  </div>
                )}
                <div className="action-buttons">
                  {/* Only show free sample button if product is NOT a coffee machine */}
                  {displayProduct.productType !== PRODUCT_TYPES.MACHINE && (
                    <button
                      className="sample-button"
                      onClick={addToSampleCart}
                    >
                      <ShoppingCart size={18} />
                      {t('orderFreeSample') || 'Order Free Sample'}
                    </button>
                  )}
                  <button
                    className="contact-button"
                    onClick={() => {
                      const productName = displayProduct.name;
                      const message = `Hi, I'm interested in ${productName} for wholesale. Could you please provide more details about bulk pricing and availability?`;
                      const whatsappUrl = `https://wa.me/905395004444?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    {t('contactForWholesale')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {displayProduct.cupping && (
        <section className="cupping-scores" ref={cuppingRef}>
          <div className="productdetail-container">
            <div className="cupping-header">
              <h2>Cupping Scores</h2>
              {displayProduct.score !== null && displayProduct.score !== undefined && scrollProgress > 0.75 && (
                <div className="final-score-display">
                  <span className="final-score-number">{displayProduct.score}</span>
                  <span className="final-score-label">Overall Score</span>
                </div>
              )}
            </div>
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

      {/* Sample Success Notification */}
      {showSampleSuccess && (
        <div className="sample-success-notification">
          <div className="sample-success-content">
            <ShoppingCart size={20} />
            <span>{t('sampleAddedToCart') || 'Sample added to cart!'}</span>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && productImages.length > 0 && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>
              <X size={24} />
            </button>

            <div className="modal-image-container">
              <img
                src={productImages[currentImageIndex]}
                alt={`${displayProduct.name} - Image ${currentImageIndex + 1}`}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='300' cy='160' r='40'/%3E%3Cellipse cx='300' cy='240' rx='60' ry='40'/%3E%3C/g%3E%3Ctext x='300' y='320' text-anchor='middle' fill='%23503c2b' font-size='32'%3ECoffee%3C/text%3E%3C/svg%3E";
                }}
              />

              {hasMultipleImages && (
                <>
                  <button
                    className="modal-nav-btn prev-btn"
                    onClick={prevImage}
                    title="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="modal-nav-btn next-btn"
                    onClick={nextImage}
                    title="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="modal-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='30' cy='24' r='4'/%3E%3Cellipse cx='30' cy='36' rx='8' ry='4'/%3E%3C/g%3E%3C/svg%3E";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="modal-info">
              <span className="modal-counter">{currentImageIndex + 1} / {productImages.length}</span>
              <span className="modal-title">{displayProduct.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail