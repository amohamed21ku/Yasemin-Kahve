import React from 'react'
import { useTranslation } from '../../../useTranslation'
import { PRODUCT_TYPES } from '../../../services/productService'
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

  // Filter categories based on selected product type
  const getFilteredCategories = () => {
    if (selectedProductType === 'All') {
      return categories;
    }

    return categories.filter(category => {
      // Check if category belongs to the selected product type
      return category.productType === selectedProductType;
    });
  };

  const filteredCategories = getFilteredCategories();

  // Create categories list with All option
  const categoriesToShow = [
    { key: 'All', label: t("all") || "All" },
    ...filteredCategories.map(cat => ({
      key: cat.id,
      label: getLocalizedCategoryName(cat)
    }))
  ];

  // Product types list
  const productTypesToShow = [
    { key: 'All', label: t('allProducts') || 'All Products' },
    { key: PRODUCT_TYPES.COFFEE, label: t('coffee') || 'Coffee' },
    { key: PRODUCT_TYPES.MACHINE, label: t('coffeeMachines') || 'Coffee Machines' },
    { key: PRODUCT_TYPES.CARDAMOM, label: t('cardamom') || 'Cardamom' }
  ];

  return (
    <div className={`product-filter-tabs ${compact ? 'compact' : ''}`}>
      {showProductTypes && (
        <div className="filter-section">
          <div className="filter-label">{t('productType') || 'Product Type'}:</div>
          <div className="filter-tabs">
            {productTypesToShow.map((type) => (
              <button
                key={type.key}
                className={`filter-tab product-type ${selectedProductType === type.key ? 'active' : ''}`}
                onClick={() => onProductTypeChange(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredCategories.length > 0 && (
        <div className="filter-section">
          <div className="filter-label">{t('categories') || 'Categories'}:</div>
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
        </div>
      )}
    </div>
  )
}

export default ProductFilterTabs