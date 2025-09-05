import React from 'react'
import { useTranslation } from '../../../useTranslation'
import './CategoryTabs.css'

const CategoryTabs = ({ categories = [], selectedCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  // Create categories list with All option - always use Firebase categories
  const categoriesToShow = [
    { key: 'All', label: t("all") || "All" },
    ...categories.map(cat => ({ 
      key: cat.id, 
      label: cat.name?.en || cat.name?.tr || cat.name || 'Unknown Category'
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