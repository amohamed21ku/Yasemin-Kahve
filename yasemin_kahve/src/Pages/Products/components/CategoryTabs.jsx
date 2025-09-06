import React from 'react'
import { useTranslation } from '../../../useTranslation'
import './CategoryTabs.css'

const CategoryTabs = ({ categories = [], selectedCategory, onCategoryChange }) => {
  const { t, language } = useTranslation();

  // Helper function to get localized category name
  const getLocalizedCategoryName = (category) => {
    if (category.name && typeof category.name === 'object') {
      return category.name[language] || category.name.en || category.name.tr || 'Unknown Category';
    }
    return category.name || 'Unknown Category';
  };

  // Create categories list with All option - always use Firebase categories
  const categoriesToShow = [
    { key: 'All', label: t("all") || "All" },
    ...categories.map(cat => ({ 
      key: cat.id, 
      label: getLocalizedCategoryName(cat)
    }))
  ];

  return (
    <div className="category-tabs">
      <div className="category-tabs-container">
        {categoriesToShow.map((category) => (
          <button
            key={category.key}
            className={`category-tab ${selectedCategory === category.key ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs