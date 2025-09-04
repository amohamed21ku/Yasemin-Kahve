import React from 'react'
import { useTranslation } from '/src/useTranslation'
import './CategoryTabs.css'

const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  // Default categories with translations
  const defaultCategories = [
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

  // Use provided categories or default ones
  const categoriesToShow = categories || defaultCategories;

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