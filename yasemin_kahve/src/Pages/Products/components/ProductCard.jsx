import React, { useState } from 'react'
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { getCountryFlagCode } from '../../../utils/countryFlags'
import './ProductCard.css'

const ProductCard = ({ product, onClick }) => {
  const { language } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all product images
  const productImages = product?.images || (product?.image ? [product.image] : []);
  const hasMultipleImages = productImages.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };


  const getCountryFlag = (origin) => {
    const flagCode = getCountryFlagCode(origin);

    if (flagCode) {
      return <span className={`fi fi-${flagCode}`} style={{ fontSize: '1.2em' }}></span>;
    }
    return <span style={{ fontSize: '1.2em' }}>🌍</span>;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  // Helper function to get localized name
  const getLocalizedName = () => {
    if (product.name && typeof product.name === 'object') {
      return product.name[language] || product.name.en || product.name.tr || 'Unknown Product';
    }
    return product.name || 'Unknown Product';
  };

  // Helper function to get localized description
  const getLocalizedDescription = () => {
    if (product.description && typeof product.description === 'object') {
      return product.description[language] || product.description.en || product.description.tr || '';
    }
    return product.description || '';
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        {productImages.length > 0 ? (
          <>
            <img
              src={productImages[currentImageIndex]}
              alt={`${getLocalizedName()} - Image ${currentImageIndex + 1}`}
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='100' cy='80' r='15'/%3E%3Cellipse cx='100' cy='120' rx='25' ry='15'/%3E%3C/g%3E%3Ctext x='100' y='160' text-anchor='middle' fill='%23503c2b' font-size='12'%3ECoffee%3C/text%3E%3C/svg%3E";
              }}
            />

            {hasMultipleImages && (
              <>
                <button
                  className="image-nav-btn prev-btn"
                  onClick={prevImage}
                  title="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="image-nav-btn next-btn"
                  onClick={nextImage}
                  title="Next image"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="image-indicators">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      title={`Image ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="image-counter">
                  {currentImageIndex + 1}/{productImages.length}
                </div>
              </>
            )}
          </>
        ) : (
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='100' cy='80' r='15'/%3E%3Cellipse cx='100' cy='120' rx='25' ry='15'/%3E%3C/g%3E%3Ctext x='100' y='160' text-anchor='middle' fill='%23503c2b' font-size='12'%3ECoffee%3C/text%3E%3C/svg%3E"
            alt={getLocalizedName()}
          />
        )}

        <div className="product-overlay">
          <div className="product-flag">{getCountryFlag(product.origin)}</div>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{getLocalizedName()}</h3>
        
        
        {product.roastLevel && (
          <div className="product-details">
            <span className="roast-level">Roast: {product.roastLevel}</span>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default ProductCard