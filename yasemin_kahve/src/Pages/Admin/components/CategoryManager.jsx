import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../useTranslation';
import { Plus, Edit3, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { categoryService } from '../../../services/productService';
import './CategoryManager.css';

const CategoryManager = ({ onClose, onCategoriesUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    nameTr: '',
    description: '',
    descriptionEn: '',
    descriptionTr: ''
  });
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameEn: '',
      nameTr: '',
      description: '',
      descriptionEn: '',
      descriptionTr: ''
    });
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      nameEn: category.name?.en || '',
      nameTr: category.name?.tr || '',
      description: category.description || '',
      descriptionEn: category.description?.en || '',
      descriptionTr: category.description?.tr || ''
    });
    setShowForm(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.nameEn.trim() || !formData.nameTr.trim()) {
      alert(t('categoryNameRequired') || 'Category name is required in both languages');
      return;
    }

    // Check for duplicate category names
    const nameEnLower = formData.nameEn.trim().toLowerCase();
    const nameTrLower = formData.nameTr.trim().toLowerCase();
    
    const duplicate = categories.find(cat => {
      if (editingCategory && cat.id === editingCategory.id) {
        return false; // Allow editing the same category
      }
      const existingEnName = (cat.name?.en || '').toLowerCase();
      const existingTrName = (cat.name?.tr || '').toLowerCase();
      return existingEnName === nameEnLower || existingTrName === nameTrLower;
    });
    
    if (duplicate) {
      alert(t('duplicateCategoryName') || 'A category with this name already exists. Please choose a different name.');
      return;
    }

    try {
      setSaving(true);
      const categoryData = {
        name: {
          en: formData.nameEn.trim(),
          tr: formData.nameTr.trim()
        },
        description: {
          en: formData.descriptionEn.trim(),
          tr: formData.descriptionTr.trim()
        }
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryData);
      } else {
        await categoryService.addCategory(categoryData);
      }

      await fetchCategories();
      if (onCategoriesUpdate) {
        onCategoriesUpdate();
      }
      
      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        nameEn: '',
        nameTr: '',
        description: '',
        descriptionEn: '',
        descriptionTr: ''
      });
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(t('confirmDeleteCategory') || 'Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      await fetchCategories();
      if (onCategoriesUpdate) {
        onCategoriesUpdate();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.message || 'Failed to delete category');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="category-manager-loading">
        <div className="category-loading-spinner">
          <div className="category-spinner"></div>
        </div>
        <p>{t('loadingCategories') || 'Loading categories...'}</p>
      </div>
    );
  }

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={onClose}
          >
            <ArrowLeft size={20} />
            {t('backToProducts') || 'Back to Products'}
          </button>
          <h1>{t('categoryManagement') || 'Category Management'}</h1>
          <p>{t('manageCategoriesDesc') || 'Add, edit, and organize product categories'}</p>
        </div>
        
        <button
          className="add-category-btn"
          onClick={handleAddCategory}
          disabled={showForm}
        >
          <Plus size={18} />
          {t('addNewCategory') || 'Add New Category'}
        </button>
      </div>

      {showForm && (
        <div className="category-form-card">
          <div className="form-header">
            <h3>
              {editingCategory 
                ? (t('editCategory') || 'Edit Category')
                : (t('addNewCategory') || 'Add New Category')
              }
            </h3>
            <button 
              className="close-form-btn"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="category-form">
            <div className="form-row">
              <div className="category-form-group">
                <label>{t('categoryNameEn') || 'Category Name (English)'} *</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange('nameEn', e.target.value)}
                  placeholder="e.g., Brazilian"
                  required
                />
              </div>
              <div className="category-form-group">
                <label>{t('categoryNameTr') || 'Category Name (Turkish)'} *</label>
                <input
                  type="text"
                  value={formData.nameTr}
                  onChange={(e) => handleInputChange('nameTr', e.target.value)}
                  placeholder="e.g., Brezilya"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="category-form-group">
                <label>{t('categoryDescEn') || 'Description (English)'}</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                  placeholder="Optional description in English"
                  rows="3"
                />
              </div>
              <div className="category-form-group">
                <label>{t('categoryDescTr') || 'Description (Turkish)'}</label>
                <textarea
                  value={formData.descriptionTr}
                  onChange={(e) => handleInputChange('descriptionTr', e.target.value)}
                  placeholder="Optional description in Turkish"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                className="save-btn"
                onClick={handleSaveCategory}
                disabled={saving || !formData.nameEn.trim() || !formData.nameTr.trim()}
              >
                <Save size={18} />
                {saving 
                  ? (t('saving') || 'Saving...') 
                  : editingCategory 
                    ? (t('updateCategory') || 'Update Category')
                    : (t('addCategory') || 'Add Category')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="no-categories">
            <h3>{t('noCategoriesYet') || 'No categories yet'}</h3>
            <p>{t('addFirstCategory') || 'Add your first category to get started'}</p>
            <button
              className="add-first-category-btn"
              onClick={handleAddCategory}
            >
              {t('addFirstCategory2') || 'Add First Category'}
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-content">
                <h3 className="category-name">
                  {category.name?.en || category.name}
                </h3>
                <p className="category-name-alt">
                  {category.name?.tr}
                </p>
                {(category.description?.en || category.description) && (
                  <p className="category-description">
                    {category.description?.en || category.description}
                  </p>
                )}
              </div>
              
              <div className="category-actions">
                <button
                  className="edit-category-btn"
                  onClick={() => handleEditCategory(category)}
                  title={t('editCategory') || 'Edit Category'}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="delete-category-btn"
                  onClick={() => handleDeleteCategory(category.id)}
                  title={t('deleteCategory') || 'Delete Category'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;