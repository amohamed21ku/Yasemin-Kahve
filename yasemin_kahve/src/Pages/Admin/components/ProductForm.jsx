import React, { useState, useRef } from 'react';
import { useTranslation } from '../../../useTranslation';
import { Camera, Upload, X, Eye, EyeOff, Globe, DollarSign, AlertCircle, Plus } from 'lucide-react';
import { categoryService } from '../../../services/productService';
import CountrySelector from './CountrySelector';
import './ProductForm.css';

const ProductForm = ({ product, categories = [], onSave, onCancel }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef();
  
  const [formData, setFormData] = useState({
    name: {
      en: product?.name?.en || '',
      tr: product?.name?.tr || ''
    },
    description: {
      en: product?.description?.en || '',
      tr: product?.description?.tr || ''
    },
    categoryId: product?.categoryId || (categories[0]?.id || ''),
    origin: product?.origin || '',
    badge: product?.badge || '',
    price: product?.price || '',
    currency: product?.currency || 'TRY',
    score: product?.score !== null && product?.score !== undefined ? product.score : 8.5,
    images: product?.images || (product?.image ? [product.image] : []),
    isVisible: product?.isVisible !== false,
    // Additional product specifications
    region: product?.region || '',
    classification: product?.classification || '',
    processing: product?.processing || '',
    type: product?.type || '',
    altitude: product?.altitude || '',
    bagType: product?.bagType || '',
    bagSize: product?.bagSize || '',
    brewingMethods: product?.brewingMethods || [],
    tastingNotes: product?.tastingNotes || [],
    cupping: {
      aroma: product?.cupping?.aroma || 8.0,
      flavor: product?.cupping?.flavor || 8.0,
      acidity: product?.cupping?.acidity || 8.0,
      body: product?.cupping?.body || 8.0,
      balance: product?.cupping?.balance || 8.0
    }
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product?.images || (product?.image ? [product.image] : []));
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState({ en: '', tr: '' });
  const [showCuppingScores, setShowCuppingScores] = useState(() => {
    // Show cupping scores if product has existing scores (not all default values)
    if (product?.cupping) {
      const { aroma, flavor, acidity, body, balance } = product.cupping;
      return !(aroma === 8.0 && flavor === 8.0 && acidity === 8.0 && body === 8.0 && balance === 8.0);
    }
    return false;
  });
  
  const [showScore, setShowScore] = useState(() => {
    // Show score if product has a score that's not null/undefined
    return product?.score !== undefined && product?.score !== null;
  });


  const handleInputChange = (field, value, language = null) => {
    if (language) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [language]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit (max 5 images)
    if (imagePreviews.length + files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: t('tooManyImages') || 'Maximum 5 images allowed'
      }));
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: t('imageTooLarge') || 'One or more image files are too large (max 5MB each)'
        }));
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          images: t('invalidImageType') || 'Please select valid image files only'
        }));
        continue;
      }

      validFiles.push(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);

        // Update previews when all files are loaded
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles]);

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        images: undefined
      }));
    }

    // Reset the file input
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));

    // Update form data
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];
    const newFormImages = [...formData.images];

    // Move preview
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    newPreviews.splice(toIndex, 0, movedPreview);

    // Move file if it exists
    if (newFiles[fromIndex]) {
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
    }

    // Move form data image
    if (newFormImages[fromIndex]) {
      const [movedFormImage] = newFormImages.splice(fromIndex, 1);
      newFormImages.splice(toIndex, 0, movedFormImage);
    }

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      images: newFormImages
    }));
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.en.trim() && !newCategoryName.tr.trim()) {
      setErrors(prev => ({ ...prev, newCategory: 'Category name is required in at least one language' }));
      return;
    }

    // Check for duplicate category names
    const nameEnLower = newCategoryName.en.trim().toLowerCase();
    const nameTrLower = newCategoryName.tr.trim().toLowerCase();
    
    const duplicate = categories.find(cat => {
      const existingEnName = (cat.name?.en || '').toLowerCase();
      const existingTrName = (cat.name?.tr || '').toLowerCase();
      return (nameEnLower && existingEnName === nameEnLower) || (nameTrLower && existingTrName === nameTrLower);
    });
    
    if (duplicate) {
      setErrors(prev => ({ ...prev, newCategory: 'A category with this name already exists. Please choose a different name.' }));
      return;
    }

    try {
      setUploading(true);
      const categoryData = {
        name: {
          en: newCategoryName.en.trim(),
          tr: newCategoryName.tr.trim()
        }
      };
      
      const newCategoryId = await categoryService.addCategory(categoryData);
      
      // Add the new category to the categories list
      const newCategory = { id: newCategoryId, ...categoryData };
      
      // Reset form
      setNewCategoryName({ en: '', tr: '' });
      setShowNewCategoryForm(false);
      
      // Select the new category
      setFormData(prev => ({ ...prev, categoryId: newCategoryId }));
      
      // Clear errors
      setErrors(prev => ({ ...prev, newCategory: undefined }));
      
      // Notify parent to refresh categories
      window.dispatchEvent(new CustomEvent('categoryAdded', { detail: newCategory }));
      
    } catch (error) {
      console.error('Error adding category:', error);
      setErrors(prev => ({ ...prev, newCategory: error.message }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.en.trim() && !formData.name.tr.trim()) {
      newErrors.name = t('productNameRequired') || 'Product name is required in at least one language';
    }
    
    if (!formData.description.en.trim() && !formData.description.tr.trim()) {
      newErrors.description = t('productDescriptionRequired') || 'Product description is required in at least one language';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = t('categoryRequired') || 'Category is required';
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      const productData = {
        ...formData
      };

      // If cupping scores are not enabled, remove cupping data or set to null
      if (!showCuppingScores) {
        productData.cupping = null;
      }

      // If score is not enabled, set to null
      if (!showScore) {
        productData.score = null;
      }

      // If price is empty, set to null or empty string
      if (!formData.price || formData.price.trim() === '') {
        productData.price = null;
      }

      // Pass imageFiles array if new images were selected
      // The service will handle image preservation automatically
      const result = await onSave(productData, imageFiles);

      if (result.success) {
        // Form will be closed by parent component
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h1>
          {product 
            ? (t('editProduct') || 'Edit Product') 
            : (t('addNewProduct') || 'Add New Product')
          }
        </h1>
        <button 
          className="close-btn"
          onClick={onCancel}
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      {errors.submit && (
        <div className="error-message">
          <AlertCircle size={20} />
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        {/* Image Upload */}
        <div className="form-section">
          <h3>{t('productImages') || 'Product Images'} <span className="optional-label">({t('max5Images') || 'Max 5 images'})</span></h3>

          <div className="image-upload-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            {imagePreviews.length > 0 ? (
              <div className="images-grid">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Product preview ${index + 1}`} />
                    <div className="image-overlay">
                      <div className="image-controls">
                        {index > 0 && (
                          <button
                            type="button"
                            className="move-image-btn move-left"
                            onClick={() => moveImage(index, index - 1)}
                            title="Move left"
                          >
                            ←
                          </button>
                        )}
                        {index < imagePreviews.length - 1 && (
                          <button
                            type="button"
                            className="move-image-btn move-right"
                            onClick={() => moveImage(index, index + 1)}
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="primary-badge">
                        {t('primary') || 'Primary'}
                      </div>
                    )}
                  </div>
                ))}

                {imagePreviews.length < 5 && (
                  <div className="add-more-images" onClick={() => fileInputRef.current?.click()}>
                    <div className="add-icon">
                      <Plus size={24} />
                    </div>
                    <p>{t('addMoreImages') || 'Add More Images'}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">
                  <Upload size={48} />
                </div>
                <p>{t('clickToUploadImages') || 'Click to upload product images'}</p>
                <span>{t('supportedFormats') || 'JPG, PNG, GIF up to 5MB each, maximum 5 images'}</span>
              </div>
            )}
          </div>

          {errors.images && (
            <span className="field-error">{errors.images}</span>
          )}
        </div>

        {/* Product Names */}
        <div className="form-section">
          <h3>{t('productName') || 'Product Name'}</h3>
          
          <div className="language-inputs">
            <div className="language-input">
              <label>
                <Globe size={16} />
                {t('english') || 'English'}
              </label>
              <input
                type="text"
                value={formData.name.en}
                onChange={(e) => handleInputChange('name', e.target.value, 'en')}
                placeholder={t('enterNameEnglish') || 'Enter product name in English'}
                className={errors.name ? 'error' : ''}
              />
            </div>
            
            <div className="language-input">
              <label>
                <Globe size={16} />
                {t('turkish') || 'Türkçe'}
              </label>
              <input
                type="text"
                value={formData.name.tr}
                onChange={(e) => handleInputChange('name', e.target.value, 'tr')}
                placeholder={t('enterNameTurkish') || 'Ürün adını Türkçe girin'}
                className={errors.name ? 'error' : ''}
              />
            </div>
          </div>
          
          {errors.name && (
            <span className="field-error">{errors.name}</span>
          )}
        </div>

        {/* Category & Origin */}
        <div className="form-section">
          <h3>{t('categoryAndOrigin') || 'Category & Origin'}</h3>
          
          <div className="category-origin-inputs">
            <div className="productform-form-group">
              <label>{t('category') || 'Category'}</label>
              <div className="category-selection-container">
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={errors.categoryId ? 'error' : ''}
                  disabled={showNewCategoryForm}
                >
                  <option value="">{t('selectCategory') || 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name?.en || cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="add-category-btn"
                  onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
                  disabled={uploading}
                  title={showNewCategoryForm ? 'Cancel' : 'Add New Category'}
                >
                  {showNewCategoryForm ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>
              
              {showNewCategoryForm && (
                <div className="new-category-form">
                  <div className="new-category-inputs">
                    <div className="language-input-small">
                      <label>
                        <Globe size={14} />
                        {t('english') || 'English'}
                      </label>
                      <input
                        type="text"
                        value={newCategoryName.en}
                        onChange={(e) => setNewCategoryName(prev => ({ ...prev, en: e.target.value }))}
                        placeholder={t('enterCategoryNameEnglish') || 'Category name in English'}
                        className={errors.newCategory ? 'error' : ''}
                      />
                    </div>
                    <div className="language-input-small">
                      <label>
                        <Globe size={14} />
                        {t('turkish') || 'Türkçe'}
                      </label>
                      <input
                        type="text"
                        value={newCategoryName.tr}
                        onChange={(e) => setNewCategoryName(prev => ({ ...prev, tr: e.target.value }))}
                        placeholder={t('enterCategoryNameTurkish') || 'Kategori adını Türkçe girin'}
                        className={errors.newCategory ? 'error' : ''}
                      />
                    </div>
                  </div>
                  <div className="new-category-actions">
                    <button
                      type="button"
                      className="add-category-save-btn"
                      onClick={handleAddNewCategory}
                      disabled={uploading || (!newCategoryName.en.trim() && !newCategoryName.tr.trim())}
                    >
                      {uploading ? 'Adding...' : (t('addCategory') || 'Add Category')}
                    </button>
                  </div>
                </div>
              )}
              
              {errors.categoryId && (
                <span className="field-error">{errors.categoryId}</span>
              )}
              {errors.newCategory && (
                <span className="field-error">{errors.newCategory}</span>
              )}
            </div>
            
            <div className="productform-form-group">
              <label>{t('origin') || 'Origin Country'}</label>
              <CountrySelector
                value={formData.origin}
                onChange={(value) => handleInputChange('origin', value)}
                placeholder={t('selectOriginCountry') || 'Select origin country...'}
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="form-section">
          <h3>{t('badge') || 'Product Badge'}</h3>
          
          <input className='badge-input' 
            type="text"
            value={formData.badge}
            onChange={(e) => handleInputChange('badge', e.target.value)}
            placeholder={t('enterBadge') || 'e.g., Premium, Best Seller, New (optional)'}
          />
          <small>{t('badgeOptional') || 'Optional badge to highlight special features'}</small>
        </div>

        {/* Price */}
        <div className="form-section">
          <h3>{t('pricing') || 'Pricing'}</h3>
          
          <div className="price-inputs">
            <div className="price-input-group">
              <label>
                <DollarSign size={16} />
                {t('price') || 'Price'}
              </label>
              <div className="price-input-container">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder={t('enterPrice') || 'Enter price'}
                  className={errors.price ? 'error' : ''}
                />
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="currency-select"
                >
                  <option value="TRY">₺ TRY</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
              {errors.price && (
                <span className="field-error">{errors.price}</span>
              )}
            </div>
          </div>
        </div>

        {/* Product Descriptions */}
        <div className="form-section">
          <h3>{t('productDescription') || 'Product Description'}</h3>
          
          <div className="language-inputs">
            <div className="language-input">
              <label>
                <Globe size={16} />
                {t('english') || 'English'} - {t('shortDescription') || 'Short Description'}
              </label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                placeholder={t('enterDescriptionEnglish') || 'Enter short product description in English'}
                rows="3"
                className={errors.description ? 'error' : ''}
              />
            </div>
            
            <div className="language-input">
              <label>
                <Globe size={16} />
                {t('turkish') || 'Türkçe'} - {t('shortDescription') || 'Kısa Açıklama'}
              </label>
              <textarea
                value={formData.description.tr}
                onChange={(e) => handleInputChange('description', e.target.value, 'tr')}
                placeholder={t('enterDescriptionTurkish') || 'Ürün kısa açıklamasını Türkçe girin'}
                rows="3"
                className={errors.description ? 'error' : ''}
              />
            </div>
          </div>
          
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
        </div>


        {/* Product Specifications */}
        <div className="form-section">
          <h3>{t('productSpecifications') || 'Product Specifications'}</h3>
          
          <div className="specs-input-grid">
            <div className="productform-form-group">
              <label>{t('score') || 'Score'}</label>
              
              <div className="score-toggle">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showScore}
                    onChange={(e) => setShowScore(e.target.checked)}
                  />
                  <span className="checkbox-text">
                    {t('includeScore') || 'Include quality score for this product'}
                  </span>
                </label>
              </div>
              
              {showScore && (
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.score}
                  onChange={(e) => handleInputChange('score', parseFloat(e.target.value) || 0)}
                  placeholder="8.5"
                />
              )}
              <small>{t('scoreHelp') || 'Quality score is optional. Only enable for products that have been evaluated.'}</small>
            </div>
            
            <div className="productform-form-group">
              <label>{t('region') || 'Region'}</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder={t('regionPlaceholder') || 'e.g., Huila, Nariño, Cauca'}
              />
            </div>
            
            <div className="productform-form-group">
              <label>{t('classification') || 'Classification'}</label>
              <select
                value={formData.classification}
                onChange={(e) => handleInputChange('classification', e.target.value)}
              >
                <option value="">{t('selectClassification') || 'Select Classification'}</option>
                <option value="Specialty">Specialty</option>
                <option value="Premium">Premium</option>
                <option value="Commercial">Commercial</option>
                <option value="Organic">Organic</option>
                <option value="Fair Trade">Fair Trade</option>
              </select>
            </div>
            
            <div className="productform-form-group">
              <label>{t('processing') || 'Processing'}</label>
              <select
                value={formData.processing}
                onChange={(e) => handleInputChange('processing', e.target.value)}
              >
                <option value="">{t('selectProcessing') || 'Select Processing Method'}</option>
                <option value="Washed">Washed</option>
                <option value="Natural">Natural</option>
                <option value="Honey">Honey</option>
                <option value="Pulped Natural">Pulped Natural</option>
                <option value="Semi-Washed">Semi-Washed</option>
                <option value="Wet Hulled">Wet Hulled</option>
              </select>
            </div>
            
            <div className="productform-form-group">
              <label>{t('type') || 'Type'}</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="">{t('selectType') || 'Select Coffee Type'}</option>
                <option value="Arabica">Arabica</option>
                <option value="Robusta">Robusta</option>
                <option value="Liberica">Liberica</option>
                <option value="Excelsa">Excelsa</option>
                <option value="Blend">Blend</option>
              </select>
            </div>
            
            <div className="productform-form-group">
              <label>{t('altitude') || 'Altitude'}</label>
              <input
                type="text"
                value={formData.altitude}
                onChange={(e) => handleInputChange('altitude', e.target.value)}
                placeholder={t('altitudePlaceholder') || 'e.g., 1,200-1,800m'}
              />
            </div>
            
            <div className="productform-form-group">
              <label>{t('bagType') || 'Bag Type'}</label>
              <select
                value={formData.bagType}
                onChange={(e) => handleInputChange('bagType', e.target.value)}
              >
                <option value="">{t('selectBagType') || 'Select Bag Type'}</option>
                <option value="Jute">Jute</option>
                <option value="Burlap">Burlap</option>
                <option value="GrainPro">GrainPro</option>
                <option value="Vacuum">Vacuum</option>
                <option value="Ecotact">Ecotact</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="productform-form-group">
              <label>{t('bagSize') || 'Bag Size (kg)'}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.bagSize}
                onChange={(e) => handleInputChange('bagSize', e.target.value)}
                placeholder={t('bagSizePlaceholder') || 'e.g., 60, 30, 1'}
              />
            </div>
          </div>
        </div>

        {/* Tasting Notes */}
        <div className="form-section">
          <h3>{t('tastingNotes') || 'Tasting Notes'}</h3>

          <div className="tasting-notes-input">
            <input
              type="text"
              value={formData.tastingNotes.join(', ')}
              onChange={(e) => {
                const notes = e.target.value.split(',').map(note => note.trim()).filter(note => note);
                handleInputChange('tastingNotes', notes);
              }}
              placeholder={t('tastingNotesPlaceholder') || 'e.g., Chocolate, Citrus, Caramel, Nutty (separate with commas)'}
            />
            <small>{t('tastingNotesHelp') || 'Separate multiple tasting notes with commas. Spaces around commas are automatically handled.'}</small>
          </div>
        </div>

        {/* Brewing Methods */}
        <div className="form-section">
          <h3>{t('brewingMethods') || 'Good for use in'}</h3>

          <div className="brewing-methods-selection">
            <div className="brewing-methods-grid">
              {[
                { value: 'espresso', label: t('espresso') || 'Espresso' },
                { value: 'moka', label: t('moka') || 'Moka Pot' },
                { value: 'cappuccino', label: t('cappuccino') || 'Cappuccino' },
                { value: 'french-press', label: t('frenchPress') || 'French Press' },
                { value: 'pour-over', label: t('pourOver') || 'Pour Over' },
                { value: 'drip', label: t('drip') || 'Drip Coffee' },
                { value: 'cold-brew', label: t('coldBrew') || 'Cold Brew' },
                { value: 'turkish', label: t('turkish') || 'Turkish Coffee' }
              ].map(method => (
                <label key={method.value} className="brewing-method-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.brewingMethods.includes(method.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('brewingMethods', [...formData.brewingMethods, method.value]);
                      } else {
                        handleInputChange('brewingMethods', formData.brewingMethods.filter(m => m !== method.value));
                      }
                    }}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="method-label">{method.label}</span>
                </label>
              ))}
            </div>
            <small>{t('brewingMethodsHelp') || 'Select all brewing methods that work well with this coffee.'}</small>
          </div>
        </div>

        {/* Cupping Scores */}
        <div className="form-section">
          <h3>{t('cuppingScores') || 'Cupping Scores'}</h3>
          
          <div className="cupping-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showCuppingScores}
                onChange={(e) => setShowCuppingScores(e.target.checked)}
              />
              <span className="checkbox-text">
                {t('includeCuppingScores') || 'Include cupping scores for this product'}
              </span>
            </label>
            <small>{t('cuppingToggleHelp') || 'Check this option if this product has cupping scores. Some products like cardamom, accessories, or non-coffee items may not need cupping scores.'}</small>
          </div>
          
          {showCuppingScores && (
            <div className="cupping-scores-grid">
              <div className="productform-form-group">
                <label>{t('aroma') || 'Aroma'}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cupping.aroma}
                  onChange={(e) => handleInputChange('cupping', { ...formData.cupping, aroma: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="productform-form-group">
                <label>{t('flavor') || 'Flavor'}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cupping.flavor}
                  onChange={(e) => handleInputChange('cupping', { ...formData.cupping, flavor: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="productform-form-group">
                <label>{t('acidity') || 'Acidity'}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cupping.acidity}
                  onChange={(e) => handleInputChange('cupping', { ...formData.cupping, acidity: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="productform-form-group">
                <label>{t('body') || 'Body'}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cupping.body}
                  onChange={(e) => handleInputChange('cupping', { ...formData.cupping, body: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="productform-form-group">
                <label>{t('balance') || 'Balance'}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cupping.balance}
                  onChange={(e) => handleInputChange('cupping', { ...formData.cupping, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}
          <small>{t('cuppingScoresHelp') || 'Cupping scores are rated from 0 to 10. Only enable if this product is a coffee that has been cupped.'}</small>
        </div>

        {/* Visibility */}
        <div className="form-section">
          <h3>{t('visibility') || 'Visibility'}</h3>
          
          <div className="visibility-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => handleInputChange('isVisible', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {formData.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                {formData.isVisible 
                  ? (t('productVisible') || 'Product is visible to customers') 
                  : (t('productHidden') || 'Product is hidden from customers')
                }
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="productform-cancel-btn"
            onClick={onCancel}
            disabled={uploading}
          >
            {t('cancel') || 'Cancel'}
          </button>
          
          <button
            type="submit"
            className="productform-save-btn"
            disabled={uploading}
          >
            {uploading ? (
              <div className="loading-content">
                <div className="spinner"></div>
                {t('saving') || 'Saving...'}
              </div>
            ) : (
              <>
                {product 
                  ? (t('updateProduct') || 'Update Product') 
                  : (t('createProduct') || 'Create Product')
                }
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;