import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../useTranslation';
import { Plus, Search, Coffee, Edit3, Trash2, Eye, EyeOff, Settings, X } from 'lucide-react';
import { productService, categoryService, PRODUCT_TYPES } from '../../../services/productService';
import CoffeeForm from './CoffeeForm';
import MachineForm from './MachineForm';
import CardamomForm from './CardamomForm';
import CategoryManager from './CategoryManager';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showProductTypeSelector, setShowProductTypeSelector] = useState(false);
  const [selectedFormProductType, setSelectedFormProductType] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
    
    // Listen for category additions
    const handleCategoryAdded = (event) => {
      const newCategory = event.detail;
      setCategories(prev => {
        // Check if category already exists to avoid duplicates
        const exists = prev.some(cat => cat.id === newCategory.id);
        if (!exists) {
          return [...prev, newCategory];
        }
        return prev;
      });
    };
    
    window.addEventListener('categoryAdded', handleCategoryAdded);
    
    return () => {
      window.removeEventListener('categoryAdded', handleCategoryAdded);
    };
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProductsRaw();
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories([
        { 
          id: 'all', 
          name: {
            en: 'All Categories',
            tr: 'Tüm Kategoriler'
          }
        }, 
        ...categoriesData
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([
        { 
          id: 'all', 
          name: {
            en: 'All Categories',
            tr: 'Tüm Kategoriler'
          }
        }
      ]);
    }
  };

  const handleSaveProduct = async (productData, imageFile) => {
    try {
      await productService.addProduct(productData, imageFile);
      await fetchProducts();
      setShowForm(false);
      setSelectedFormProductType(null);
      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  };

  const handleUpdateProduct = async (productData, imageFile) => {
    try {
      await productService.updateProduct(editingProduct.id, productData, imageFile);
      await fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setSelectedFormProductType(null);
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t('confirmDeleteProduct') || 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleVisibility = async (productId, isVisible) => {
    try {
      await productService.updateProduct(productId, { isVisible: !isVisible });
      setProducts(products.map(p => 
        p.id === productId ? { ...p, isVisible: !isVisible } : p
      ));
    } catch (error) {
      console.error('Error updating product visibility:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductTypeSelector(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedFormProductType(product.productType || PRODUCT_TYPES.COFFEE);
    setShowForm(true);
  };

  const handleProductTypeSelected = (productType) => {
    setSelectedFormProductType(productType);
    setShowProductTypeSelector(false);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setShowProductTypeSelector(false);
    setEditingProduct(null);
    setSelectedFormProductType(null);
  };

  const renderProductForm = () => {
    const formProps = {
      product: editingProduct,
      categories: categories.filter(c => c.id !== 'all'),
      onSave: editingProduct ? handleUpdateProduct : handleSaveProduct,
      onCancel: handleFormCancel
    };

    // Both COFFEE (retail) and WHOLESALE types use CoffeeForm
    // MACHINE is for actual coffee machines/equipment
    switch (selectedFormProductType) {
      case PRODUCT_TYPES.COFFEE:
      case PRODUCT_TYPES.WHOLESALE:
        return <CoffeeForm {...formProps} />;
      case PRODUCT_TYPES.MACHINE:
      case 'equipment':
        return <MachineForm {...formProps} />;
      case PRODUCT_TYPES.CARDAMOM:
        return <CardamomForm {...formProps} />;
      default:
        return <CoffeeForm {...formProps} />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;

    const matchesProductType = selectedProductType === 'all' ||
      (product.productType || PRODUCT_TYPES.COFFEE) === selectedProductType;

    const matchesVisibility = visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && product.isVisible !== false) ||
      (visibilityFilter === 'hidden' && product.isVisible === false);

    return matchesSearch && matchesCategory && matchesProductType && matchesVisibility;
  });

  if (loading) {
    return (
      <div className="product-management-loading">
        <div className="admin-loading-spinner">
          <div className="admin-spinner"></div>
        </div>
        <p>{t('loadingProducts') || 'Loading products...'}</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      {showCategoryManager ? (
        <CategoryManager
          onClose={() => setShowCategoryManager(false)}
          onCategoriesUpdate={fetchCategories}
        />
      ) : showProductTypeSelector ? (
        <div className="product-type-selector-container">
          <div className="product-type-selector">
            <div className="selector-header">
              <h2>{t('selectProductType') || 'Select Product Type'}</h2>
              <button
                className="close-btn"
                onClick={handleFormCancel}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <p>{t('selectProductTypeDesc') || 'Choose the type of product you want to add'}</p>

            <div className="product-type-options">
              <div
                className="product-type-option"
                onClick={() => handleProductTypeSelected(PRODUCT_TYPES.COFFEE)}
              >
                <div className="option-icon">☕</div>
                <h3>{t('coffee') || 'Green Coffee'}</h3>
                <p>{t('coffeeDescription') || 'Green coffee beans - retail or wholesale'}</p>
              </div>

              <div
                className="product-type-option"
                onClick={() => handleProductTypeSelected('equipment')}
              >
                <div className="option-icon">⚙️</div>
                <h3>{t('coffeeMachines') || 'Coffee Machines'}</h3>
                <p>{t('machineDescription') || 'Coffee brewing equipment and machines'}</p>
              </div>

              <div
                className="product-type-option"
                onClick={() => handleProductTypeSelected(PRODUCT_TYPES.CARDAMOM)}
              >
                <div className="option-icon">🌿</div>
                <h3>{t('cardamom') || 'Cardamom'}</h3>
                <p>{t('cardamomDescription') || 'Premium quality cardamom and spices'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : showForm ? (
        renderProductForm()
      ) : (
        <>
          <div className="product-management-header">
            <div className="header-content">
              <h1>{t('productManagement') || 'Product Management'}</h1>
              <p>{t('manageProductsDesc2') || 'Add, edit, and manage your coffee products'}</p>
            </div>
            
            <div className="header-actions">
              <button
                className="manage-categories-btn"
                onClick={() => setShowCategoryManager(true)}
              >
                <Settings size={18} />
                {t('manageCategories') || 'Manage Categories'}
              </button>
              <button
                className="add-product-btn"
                onClick={handleAddProduct}
              >
                <Plus size={18} />
                {t('addNewProduct') || 'Add New Product'}
              </button>
            </div>
          </div>

          <div className="product-stats">
            <div className="admin-stat-card">
              <span className="stat-number">{products.length}</span>
              <span className="stat-label">{t('totalProducts') || 'Total Products'}</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-number">{products.filter(p => p.isVisible !== false).length}</span>
              <span className="stat-label">{t('visibleProducts') || 'Visible Products'}</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-number">{products.filter(p => p.isVisible === false).length}</span>
              <span className="stat-label">{t('hiddenProducts') || 'Hidden Products'}</span>
            </div>
          </div>

          <div className="product-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder={t('searchProducts') || 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">
                <Search size={16} />
              </span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              {categories && categories.length > 0 ? categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name?.en || cat.name || 'Unknown Category'}
                </option>
              )) : (
                <option value="all">All Categories</option>
              )}
            </select>

            <select
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="product-type-filter"
            >
              <option value="all">{t('allProductTypes') || 'All Product Types'}</option>
              <option value={PRODUCT_TYPES.COFFEE}>{t('retailCoffee') || 'Retail Coffee'}</option>
              <option value={PRODUCT_TYPES.WHOLESALE}>{t('wholesaleCoffee') || 'Wholesale Coffee'}</option>
              <option value={PRODUCT_TYPES.MACHINE}>{t('coffeeMachines') || 'Coffee Machines'}</option>
              <option value={PRODUCT_TYPES.CARDAMOM}>{t('cardamom') || 'Cardamom'}</option>
            </select>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="visibility-filter"
            >
              <option value="all">{t('allProducts') || 'All Products'}</option>
              <option value="visible">{t('visibleOnly') || 'Visible Only'}</option>
              <option value="hidden">{t('hiddenOnly') || 'Hidden Only'}</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <Coffee size={64} />
              </div>
              <h3>
                {searchTerm || selectedCategory !== 'all' 
                  ? (t('noProductsFound') || 'No products found') 
                  : (t('noProductsYet') || 'No products yet')
                }
              </h3>
              <p>
                {searchTerm || selectedCategory !== 'all'
                  ? (t('tryDifferentSearch') || 'Try adjusting your search or filters')
                  : (t('addFirstProduct') || 'Add your first product to get started')
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <button
                  className="add-first-product-btn"
                  onClick={handleAddProduct}
                >
                  {t('addFirstProduct2') || 'Add First Product'}
                </button>
              )}
            </div>
          ) : (
            <div className="products-Admin-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className={`product-Admin-card ${product.isVisible === false ? 'product-hidden' : ''}`}>
                  <div className="admin-product-image">
                    {(product.images && product.images.length > 0) || product.image ? (
                      <img src={product.images && product.images.length > 0 ? product.images[0] : product.image} alt={product.name?.en || product.name?.tr} />
                    ) : (
                      <div className="no-image">
                        <Coffee size={48} />
                      </div>
                    )}
                    <div className="product-admin-overlay">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditProduct(product)}
                        title={t('editProduct') || 'Edit Product'}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        title={t('deleteProduct') || 'Delete Product'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="admin-product-info">
                    <div className="product-header">
                      <h3 className="product-admin-name">
                        {product.name?.en || product.name?.tr || 'Untitled Product'}
                      </h3>
                      <div className="product-badges">
                        <span className={`category-badge ${product.categoryId || 'default'}`}>
                          {categories.find(c => c.id === product.categoryId)?.name?.en ||
                           categories.find(c => c.id === product.categoryId)?.name ||
                           product.categoryId}
                        </span>
                        <span className={`product-type-badge ${product.productType || PRODUCT_TYPES.COFFEE}`}>
                          {product.productType === PRODUCT_TYPES.COFFEE && (t('retail') || 'Retail')}
                          {product.productType === PRODUCT_TYPES.WHOLESALE && (t('wholesale') || 'Wholesale')}
                          {product.productType === PRODUCT_TYPES.MACHINE && (t('machine') || 'Machine')}
                          {product.productType === 'equipment' && (t('machine') || 'Machine')}
                          {product.productType === PRODUCT_TYPES.CARDAMOM && (t('cardamom') || 'Cardamom')}
                          {!product.productType && (t('retail') || 'Retail')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="product-admin-description">
                      {(product.description?.en || product.description?.tr || '').slice(0, 100)}
                      {(product.description?.en || product.description?.tr || '').length > 100 && '...'}
                    </p>
                    
                    <div className="product-admin-actions">
                      <button
                        className={`visibility-btn ${product.isVisible !== false ? 'visible' : 'product-hidden'}`}
                        onClick={() => handleToggleVisibility(product.id, product.isVisible !== false)}
                        title={product.isVisible !== false ? (t('hideProduct') || 'Hide Product') : (t('showProduct') || 'Show Product')}
                      >
                        {product.isVisible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span>{product.isVisible !== false ? (t('visible') || 'Visible') : (t('hidden') || 'Hidden')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManagement;