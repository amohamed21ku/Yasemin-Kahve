import React, { useState } from "react";
import { Coffee, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "/src/useTranslation";
const ProductsPreview = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const productsPerPage = 6;

  const allProducts = [
    {
      id: 1,
      name: "COLOMBIAN 18",
      origin: "Colombia",
      description: "Premium Colombian coffee with rich, smooth taste and balanced acidity",
      image: "/static/images/assets/Products/Colombia/Colombiapng.png",
      category: "Colombian",
      price: "₺85.00",
      rating: 4.8,
      badge: "Premium"
    },
    {
      id: 2,
      name: "COLOMBIAN 19",
      origin: "Colombia", 
      description: "High-grade Colombian coffee with exceptional cup quality",
      image: "/static/images/assets/Products/Colombia/Colombiapng.png",
      category: "Colombian",
      price: "₺90.00",
      rating: 4.9,
      badge: "Best Seller"
    },
    {
      id: 3,
      name: "Indian PLANTATION A",
      origin: "India",
      description: "Premium plantation coffee with rich body and aromatic profile",
      image: "/static/images/assets/Products/Indian/Indian_A.png",
      category: "Indian",
      price: "₺75.00",
      rating: 4.7,
      badge: "Plantation"
    },
    {
      id: 4,
      name: "Indian PLANTATION AA",
      origin: "India",
      description: "Top-grade Indian plantation coffee with superior bean quality",
      image: "/static/images/assets/Products/Indian/Indian_AA.png",
      category: "Indian",
      price: "₺82.00",
      rating: 4.8,
      badge: "AA Grade"
    },
    {
      id: 5,
      name: "TUCANO BRAZILIAN",
      origin: "Brazil",
      description: "Washed 17/18 - Full-bodied with chocolate notes",
      image: "/static/images/assets/Products/Brazilian/Tucano_brazilian.png",
      category: "Brazilian",
      price: "₺70.00",
      rating: 4.6,
      badge: "Washed"
    },
    {
      id: 6,
      name: "TUCANO SUPER",
      origin: "Brazil",
      description: "Fully Washed Extra Fine Cup 17/18 - Premium quality",
      image: "/static/images/assets/Products/Brazilian/Tucano_Super.png",
      category: "Brazilian",
      price: "₺78.00",
      rating: 4.7,
      badge: "Super Grade"
    },
    {
      id: 7,
      name: "TUCANO",
      origin: "Brazil",
      description: "Rio Minas 17/18 - Classic Brazilian profile",
      image: "/static/images/assets/Products/Brazilian/Tucano.png",
      category: "Brazilian",
      price: "₺65.00",
      rating: 4.5
    },
    {
      id: 8,
      name: "FERAZ EFENDI",
      origin: "Brazil",
      description: "Extra Soft Rio Minas 17/18 - Smooth and balanced",
      image: "/static/images/assets/Products/Brazilian/Feraz Efendi.png",
      category: "Brazilian",
      price: "₺72.00",
      rating: 4.6,
      badge: "Extra Soft"
    },
    {
      id: 9,
      name: "Kenya FAQ AA",
      origin: "Kenya",
      description: "Bright acidity with wine-like characteristics and complex flavors",
      image: "/static/images/assets/Products/Kenya/Kenya.png",
      category: "Kenya",
      price: "₺95.00",
      rating: 4.9,
      badge: "AA Grade"
    },
    {
      id: 10,
      name: "Nicaragua SHG 19",
      origin: "Nicaragua",
      description: "Strictly High Grown coffee with excellent cup quality",
      image: "/static/images/assets/Products/Nicaragua/Nicaraguapng.png",
      category: "Nicaragua",
      price: "₺88.00",
      rating: 4.8,
      badge: "SHG"
    },
    {
      id: 11,
      name: "Guatemala Washed Arabica",
      origin: "Guatemala",
      description: "Washed Arabica Guatemala - Complex and well-balanced",
      image: "/static/images/assets/Products/Guatemala/Guatemala.png",
      category: "Guatemala",
      price: "₺92.00",
      rating: 4.8,
      badge: "Washed"
    },
    {
      id: 13,
      name: "Third Quality MYQ",
      origin: "Turkey",
      description: "High-quality cardamom with exceptional aroma and flavor",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺120.00",
      rating: 4.7
    },
    {
      id: 14,
      name: "Trips",
      origin: "Turkey",
      description: "Premium grade trips cardamom for culinary excellence",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺110.00",
      rating: 4.6
    },
    {
      id: 15,
      name: "Small Pale Green, Ambar Green 3",
      origin: "Turkey",
      description: "Small pale green cardamom pods with amber green coloring",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺105.00",
      rating: 4.5
    },
    {
      id: 16,
      name: "Extra Jade",
      origin: "Turkey",
      description: "Premium extra jade cardamom with superior quality",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺135.00",
      rating: 4.8,
      badge: "Premium"
    },
    {
      id: 17,
      name: "Pale Green, Ambar Green 2",
      origin: "Turkey",
      description: "Pale green cardamom with amber green grade 2 classification",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺115.00",
      rating: 4.6
    },
    {
      id: 18,
      name: "Medium Dark Green",
      origin: "Turkey",
      description: "Medium dark green cardamom pods with rich flavor profile",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺125.00",
      rating: 4.7
    },
    {
      id: 19,
      name: "Cardamom Seeds Delux",
      origin: "Turkey",
      description: "Deluxe cardamom seeds for premium culinary applications",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺140.00",
      rating: 4.8,
      badge: "Deluxe"
    },
    {
      id: 20,
      name: "Super Trips",
      origin: "Turkey",
      description: "Super quality trips cardamom - our finest grade",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺150.00",
      rating: 4.9,
      badge: "Super Grade"
    },
    {
      id: 12,
      name: "Ethiopian Arabica",
      origin: "Ethiopia",
      description: "Single origin beans from Ethiopian highlands. Floral and fruity notes with bright acidity and complex flavor profile",
      image: "/static/images/assets/Products/Ethiopian/Ethiopian_Arabica.png",
      category: "Ethiopian",
      price: "₺98.00",
      rating: 4.9,
      badge: "Single Origin"
    }
  ];

  // Randomize products order
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [randomizedProducts] = useState(() => shuffleArray(allProducts));
  
  // Categories for filtering with translations
  const categories = [
    { key: 'All', label: t("all") || "All" },
    { key: 'Colombian', label: t("colombian") || "Colombian" },
    { key: 'Indian', label: t("indian") || "Indian" },
    { key: 'Brazilian', label: t("brazilian") || "Brazilian" },
    { key: 'Ethiopian', label: t("ethiopian") || "Ethiopian" },
    { key: 'Kenya', label: t("kenya") || "Kenya" },
    { key: 'Nicaragua', label: t("nicaragua") || "Nicaragua" },
    { key: 'Guatemala', label: t("guatemala") || "Guatemala" },
    { key: 'Cardamom', label: t("cardamom") || "Cardamom" }
  ];
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? randomizedProducts 
    : randomizedProducts.filter(product => product.category === selectedCategory);

  // Country flag mapping
  const getCountryFlag = (origin) => {
    const flagMap = {
      'Colombia': '🇨🇴',
      'India': '🇮🇳', 
      'Brazil': '🇧🇷',
      'Kenya': '🇰🇪',
      'Nicaragua': '🇳🇮',
      'Guatemala': '🇬🇹',
      'Turkey': '🇹🇷',
      'Ethiopia': '🇪🇹'
    };
    return flagMap[origin] || '🌍';
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => prev > 0 ? prev - 1 : totalPages - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev < totalPages - 1 ? prev + 1 : 0);
  };

  const handleDotClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setCurrentPage(0); // Reset to first page when changing category
  };

  return (
    <section className="products-preview">
      <div className="container">
        <div className="products-header">
          <div className="section-badge">{t("ourProducts") || "Our Products"}</div>
          <h2 className="section-title">
            {t("createNewStory") || "Discover our premium coffee collection from around the world"}
          </h2>
          
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.key}
                className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="products-carousel">
          <div className="carousel-controls">
            <button 
              className="carousel-btn carousel-prev" 
              onClick={handlePrevPage}
              aria-label="Previous products"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="carousel-btn carousel-next" 
              onClick={handleNextPage}
              aria-label="Next products"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="products-grid">
            {currentProducts.map((product, index) => (
              <div 
                key={startIndex + index} 
                className="product-card"
                onClick={() => onNavigate('product-detail', null, product)}
                style={{ cursor: 'pointer' }}
              >
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
                
                <div className="product-actions">
                  <button 
                    className="product-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('product-detail', null, product);
                    }}
                  >
                    <span>{t("learnMore") || "Learn More"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          <div className="pagination-dots">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${index === currentPage ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="btn-primary" 
            onClick={() => onNavigate('products')}
          >
            <span>{t("allProducts") || "All Products"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;