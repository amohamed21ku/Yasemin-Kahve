import React, { useState, useEffect } from "react";
import { Coffee, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "/src/useTranslation";
import { productService, categoryService } from "../../../services/productService";
import { getCountryFlagCode } from "../../../utils/countryFlags";
import ProductFilterTabs from "../../Products/components/ProductFilterTabs";
const ProductsPreview = ({ onNavigate }) => {
  const { t, language } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProductType, setSelectedProductType] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 6;

  // Fetch products and categories from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both products and categories in parallel
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        
        // Only show visible products
        const visibleProducts = fetchedProducts.filter(product => product.isVisible !== false);
        setProducts(visibleProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]); // Fallback to empty array
        setCategories([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Randomize products order
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Use fetched products from Firebase
  const allProducts = products;
  
  // Helper function to get localized category name
  const getLocalizedCategoryName = (category) => {
    if (category.name && typeof category.name === 'object') {
      return category.name[language] || category.name.en || category.name.tr || 'Unknown Category';
    }
    return category.name || 'Unknown Category';
  };

  // Helper function to get localized product name
  const getLocalizedProductName = (product) => {
    if (product.name && typeof product.name === 'object') {
      return product.name[language] || product.name.en || product.name.tr || 'Unknown Product';
    }
    return product.name || 'Unknown Product';
  };

  // Helper function to get localized product description
  const getLocalizedProductDescription = (product) => {
    if (product.description && typeof product.description === 'object') {
      return product.description[language] || product.description.en || product.description.tr || '';
    }
    return product.description || '';
  };

  // Filter products based on selected category and product type
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === 'All' ||
      (product.categoryId && product.categoryId === selectedCategory);

    // Product type filter
    const matchesProductType = selectedProductType === 'All' ||
      (product.productType || 'coffee') === selectedProductType;

    return matchesCategory && matchesProductType;
  });

  // Country flag mapping using flag-icons
  const getCountryFlag = (origin) => {
    const flagCode = getCountryFlagCode(origin);

    if (flagCode) {
      return <span className={`fi fi-${flagCode}`} style={{ fontSize: '1.2em' }}></span>;
    }
    return <span style={{ fontSize: '1.2em' }}>🌍</span>;
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

  const handleProductTypeChange = (productType) => {
    setSelectedProductType(productType);
    setCurrentPage(0); // Reset to first page when changing product type
  };

  // Show loading state
  if (loading) {
    return (
      <section className="products-preview">
        <div className="container">
          <div className="products-header">
            <div className="section-badge">{t("ourProducts") || "Our Products"}</div>
            <h2 className="section-title">
              {t("createNewStory") || "Discover our premium coffee collection from around the world"}
            </h2>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div style={{ textAlign: 'center' }}>
              <Coffee size={48} color="#e6b555" style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
              <p>{t('loadingProducts') || 'Loading products...'}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-preview">
      <div className="container">
        <div className="products-header">
          <div className="section-badge">{t("ourProducts") || "Our Products"}</div>
          <h2 className="section-title">
            {t("createNewStory") || "Discover our premium coffee collection from around the world"}
          </h2>
        </div>

        {/* Product Filter Tabs Section */}
        <section className="filter-section">
          <ProductFilterTabs
            categories={categories}
            selectedCategory={selectedCategory}
            selectedProductType={selectedProductType}
            onCategoryChange={handleCategoryChange}
            onProductTypeChange={handleProductTypeChange}
            showProductTypes={true}
            compact={true}
          />
        </section>

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
                  src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                  alt={getLocalizedProductName(product)}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f8f3ed'/%3E%3Cg fill='%23e6b555'%3E%3Ccircle cx='100' cy='80' r='15'/%3E%3Cellipse cx='100' cy='120' rx='25' ry='15'/%3E%3C/g%3E%3Ctext x='100' y='160' text-anchor='middle' fill='%23503c2b' font-size='12'%3ECoffee%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="product-overlay">
                  <div className="product-flag">{getCountryFlag(product.origin)}</div>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{getLocalizedProductName(product)}</h3>
                <div className="product-origin">
                  <Coffee size={14} />
                  <span>{product.origin}</span>
                </div>
                <p className="product-description">{getLocalizedProductDescription(product)}</p>
                
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