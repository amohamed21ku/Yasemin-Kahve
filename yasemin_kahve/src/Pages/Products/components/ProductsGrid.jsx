import React from 'react'
import ProductCard from './ProductCard'
import CategoryTabs from './CategoryTabs'
import { Coffee } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'

const ProductsGrid = ({ products, categories = [], selectedCategory, onProductClick, onCategoryChange, loading = false }) => {
  const { t } = useTranslation();

  // Get category name by ID
  const getCategoryDisplayName = (categoryId) => {
    if (categoryId === 'All') return t("allProducts") || "All Products";
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      return category.name?.en || category.name?.tr || category.name || categoryId;
    }
    return categoryId;
  };


  if (loading) {
    return (
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("allProducts") || "All Products"}</h2>
            <p className="products-count">{t('loadingProducts') || 'Loading products...'}</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <Coffee size={64} color="#e6b555" style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
              <p style={{ fontSize: '1.2rem', color: '#666' }}>{t('loadingProducts') || 'Loading products...'}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === 'All' 
              ? getCategoryDisplayName('All')
              : `${getCategoryDisplayName(selectedCategory)} ${t("ourProducts") || "Products"}`
            }
          </h2>
          <p className="products-count">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        
        <div className="category-section">
          <CategoryTabs 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        
        <div className="products-grid">
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Coffee size={64} color="#e6b555" style={{ marginBottom: '1rem' }} />
              <h3>{t('noProductsFound') || 'No products found'}</h3>
              <p>{t('noProductsMessage') || 'No products available in this category.'}</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={onProductClick}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductsGrid