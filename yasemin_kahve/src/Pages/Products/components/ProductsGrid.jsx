import React from 'react'
import ProductCard from './ProductCard'
import { useTranslation } from '../../../useTranslation'

const ProductsGrid = ({ products, selectedCategory, onProductClick }) => {
  const { t } = useTranslation();

  return (
    <section className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === 'All' 
              ? (t("allProducts") || "All Products")
              : `${selectedCategory} ${t("ourProducts") || "Products"}`
            }
          </h2>
          <p className="products-count">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsGrid