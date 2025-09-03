import React from 'react'
import { Star, Award, Truck, Shield } from 'lucide-react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import { useTranslation } from '../../useTranslation'
import './Products.css'

const Products = ({ onNavigate }) => {
  const { t } = useTranslation();

  const products = [
    {
      id: 1,
      name: "Premium Arabica Blend",
      description: "Our signature blend featuring premium Arabica beans from high-altitude regions. Rich, smooth, and full-bodied with notes of chocolate and caramel.",
      image: "/images/coffee-beans-1.jpg", // Placeholder - you can add actual images
      price: "₺45.00",
      rating: 4.8,
      badge: "Best Seller",
      roastLevel: "Medium"
    },
    {
      id: 2,
      name: "Turkish Traditional Coffee",
      description: "Authentic Turkish coffee blend, finely ground and perfect for traditional Turkish coffee preparation. Rich heritage taste since 1921.",
      image: "/images/turkish-coffee.jpg",
      price: "₺35.00",
      rating: 4.9,
      badge: "Traditional",
      roastLevel: "Dark"
    },
    {
      id: 3,
      name: "Ethiopian Single Origin",
      description: "Single origin beans from Ethiopian highlands. Floral and fruity notes with bright acidity and complex flavor profile.",
      image: "/images/ethiopian-coffee.jpg",
      price: "₺55.00",
      rating: 4.7,
      badge: "Single Origin",
      roastLevel: "Light"
    },
    {
      id: 4,
      name: "Espresso Roma",
      description: "Perfect for espresso brewing with intense flavor and rich crema. Blend of South American and African beans.",
      image: "/images/espresso-beans.jpg",
      price: "₺48.00",
      rating: 4.6,
      badge: "Espresso",
      roastLevel: "Dark"
    },
    {
      id: 5,
      name: "Cold Brew Blend",
      description: "Specially crafted for cold brewing methods. Smooth, sweet, and low acidity. Perfect for summer refreshment.",
      image: "/images/cold-brew.jpg",
      price: "₺42.00",
      rating: 4.5,
      badge: "Cold Brew",
      roastLevel: "Medium"
    },
    {
      id: 6,
      name: "Decaf House Blend",
      description: "Full flavor without the caffeine. Swiss water processed to maintain all the taste while removing caffeine naturally.",
      image: "/images/decaf-coffee.jpg",
      price: "₺40.00",
      rating: 4.4,
      badge: "Decaf",
      roastLevel: "Medium"
    }
  ];

  const features = [
    {
      icon: <Award />,
      title: "Premium Quality",
      description: "Hand-selected beans from the world's finest coffee regions"
    },
    {
      icon: <Truck />,
      title: "Fresh Delivery",
      description: "Roasted to order and delivered fresh to your doorstep"
    },
    {
      icon: <Shield />,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all our coffee products"
    }
  ];

  return (
    <div className="products-page">
      <Header onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section className="products-hero">
        <div className="container">
          <h1 className="hero-title">Our Premium Coffee Collection</h1>
          <p className="hero-subtitle">
            Discover exceptional coffee beans carefully sourced from around the world. 
            Each blend tells a story of tradition, craftsmanship, and passion for the perfect cup.
          </p>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Our Coffee Selection</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      // Show placeholder if image fails to load
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmM2YwIi8+CiAgPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI1MCIgZmlsbD0iIzNjMmUyNiIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM1ZDQwMzciPkNvZmZlZSBJbWFnZTwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  <div className="product-badge">{product.badge}</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.floor(product.rating) ? "#e6b555" : "none"}
                        color="#e6b555"
                      />
                    ))}
                    <span className="rating-number">({product.rating})</span>
                  </div>
                  <p className="product-description">{product.description}</p>
                  <div className="product-details">
                    <span className="roast-level">Roast: {product.roastLevel}</span>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Education CTA */}
      <section className="education-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Learn the Art of Coffee</h2>
            <p>
              Master the techniques to brew the perfect cup with our coffee courses. 
              From basic brewing to advanced barista skills.
            </p>
            <button 
              className="cta-button"
              onClick={() => onNavigate && onNavigate('academy')}
            >
              Explore Our Academy
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Products