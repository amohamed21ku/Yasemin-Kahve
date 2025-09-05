import React from 'react'
import { Coffee } from 'lucide-react'
import './ProductCard.css'

const ProductCard = ({ product, onClick }) => {
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

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='100' cy='80' r='15'/%3E%3Cellipse cx='100' cy='120' rx='25' ry='15'/%3E%3C/g%3E%3Ctext x='100' y='160' text-anchor='middle' fill='%23503c2b' font-size='12'%3ECoffee%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="product-overlay">
          <div className="product-flag">{getCountryFlag(product.origin)}</div>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-origin">
          <Coffee size={14} />
          <span>{product.origin}</span>
        </div>
        <p className="product-description">{product.description}</p>
        
        
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