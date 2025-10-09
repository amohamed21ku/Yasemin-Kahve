import React from 'react'
import { useTranslation } from '../../../useTranslation'
import { PRODUCT_TYPES } from '../../../services/productService'
import { Coffee, ShoppingCart, Leaf } from 'lucide-react'
import './ProductFilterTabs.css'

const ProductFilterTabs = ({
  categories = [],
  selectedCategory,
  selectedProductType,
  onCategoryChange,
  onProductTypeChange,
  showProductTypes = true,
  compact = false
}) => {
  const { t, language } = useTranslation();

  // Helper function to get localized category name
  const getLocalizedCategoryName = (category) => {
    if (category.name && typeof category.name === 'object') {
      return category.name[language] || category.name.en || category.name.tr || 'Unknown Category';
    }
    return category.name || 'Unknown Category';
  };

  // Show all categories regardless of product type
  const categoriesToShow = [
    { key: 'All', label: t("all") || "All" },
    ...categories.map(cat => ({
      key: cat.id,
      label: getLocalizedCategoryName(cat)
    }))
  ];

  // Product types with icons - Professional design (Wholesale first)
  const productTypesToShow = [
    {
      key: PRODUCT_TYPES.WHOLESALE,
      label: t('wholesaleGreenCoffee') || 'Wholesale',
      icon: <Leaf size={18} />,
      description: t('wholesaleGreenCoffeeDesc') || 'Green Coffee Beans - Bulk'
    },
    {
      key: PRODUCT_TYPES.COFFEE,
      label: t('retailGreenCoffee') || 'Retail',
      icon: <Leaf size={18} />,
      description: t('retailGreenCoffeeDesc') || 'Green Coffee Beans'
    },
    {
      key: PRODUCT_TYPES.MACHINE,
      label: t('coffeeMachines') || 'Coffee Machines',
      icon: <Coffee size={18} />,
      description: t('coffeeMachinesDesc') || 'Professional Equipment'
    },
    {
      key: PRODUCT_TYPES.CARDAMOM,
      label: t('cardamom') || 'Cardamom',
      icon: <ShoppingCart size={18} />,
      description: t('spicesProducts') || 'Premium Spices'
    }
  ];

  return (
    <div className={`product-filter-tabs ${compact ? 'compact' : ''}`}>
      {showProductTypes && (
        <div className="filter-section product-type-section">
          <div className="product-type-cards">
            {productTypesToShow.map((type) => (
              <button
                key={type.key}
                className={`product-type-card ${selectedProductType === type.key ? 'active' : ''}`}
                onClick={() => onProductTypeChange(type.key)}
              >
                <div className="product-type-icon">{type.icon}</div>
                <div className="product-type-content">
                  <h3 className="product-type-label">{type.label}</h3>
                  <p className="product-type-description">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="filter-section category-section">
          <details className="category-filter-dropdown" open>
            <summary className="category-dropdown-summary">
              <span className="filter-label-inline">{t('filterByOrigin') || 'Filter by Origin'}</span>
              <span className="dropdown-icon">▼</span>
            </summary>
            <div className="filter-tabs">
              {categoriesToShow.map((category) => (
                <button
                  key={category.key}
                  className={`filter-tab category ${selectedCategory === category.key ? 'active' : ''}`}
                  onClick={() => onCategoryChange(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default ProductFilterTabs