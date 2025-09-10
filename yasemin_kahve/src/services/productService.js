import { db, storage } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

// Helper function to transform Firebase product data to frontend format
const transformFirebaseToFrontend = (firebaseProduct) => {
  return {
    id: firebaseProduct.id,
    // Keep multilingual data intact for dynamic language switching
    name: firebaseProduct.name || 'Untitled Product',
    origin: firebaseProduct.origin || '',
    description: firebaseProduct.description || '',
    image: firebaseProduct.image || '',
    category: firebaseProduct.categoryId || 'Other',
    price: firebaseProduct.price && firebaseProduct.currency ? 
           `${firebaseProduct.currency === 'TRY' ? '₺' : firebaseProduct.currency === 'USD' ? '$' : '€'}${firebaseProduct.price}` : 
           '₺0.00',
    rating: firebaseProduct.rating || 4.5,
    badge: firebaseProduct.badge || '',
    isVisible: firebaseProduct.isVisible !== false,
    // Keep original Firebase data for admin/editing purposes
    _firebaseData: firebaseProduct
  };
};

// Helper function to get category name by ID
const getCategoryName = async (categoryId) => {
  if (!categoryId) return 'Other';
  
  try {
    const categoryDoc = await getDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
    if (categoryDoc.exists()) {
      const categoryData = categoryDoc.data();
      // Return the multilingual name object, not a specific language
      return categoryData.name || categoryId;
    }
  } catch (error) {
    console.warn('Error fetching category name:', error);
  }
  
  return categoryId;
};

// Product CRUD operations
export const productService = {
  // Get all products (transformed for frontend)
  async getAllProducts() {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Transform to frontend format
      return products.map(transformFirebaseToFrontend);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get all products (raw Firebase format for admin)
  async getAllProductsRaw() {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by category (transformed for frontend)
  async getProductsByCategory(categoryId) {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return products.map(transformFirebaseToFrontend);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get products by category (for category deletion check - no ordering needed)
  async getProductsByCategorySimple(categoryId) {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        where('categoryId', '==', categoryId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get single product (transformed for frontend)
  async getProduct(productId) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const product = { id: docSnap.id, ...docSnap.data() };
        return transformFirebaseToFrontend(product);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get single product (raw Firebase format for admin)
  async getProductRaw(productId) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Add new product
  async addProduct(productData, imageFile) {
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        // Create organized folder structure: products/{productNameEN}/image
        const productNameEN = productData.name?.en || 'unnamed';
        // Sanitize the product name for use as folder name
        const sanitizedName = productNameEN
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const fileExtension = imageFile.name.split('.').pop();
        const imagePath = `products/${sanitizedName}/image.${fileExtension}`;
        
        const imageRef = ref(storage, imagePath);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId, productData, imageFile) {
    try {
      let updateData = { ...productData };
      
      // Get current product data once for all image operations
      const currentProduct = await this.getProductRaw(productId);
      
      // Handle image update logic
      if (imageFile) {
        
        // Create organized folder structure: products/{productNameEN}/image
        const productNameEN = productData.name?.en || currentProduct.name?.en || 'unnamed';
        // Sanitize the product name for use as folder name
        const sanitizedName = productNameEN
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        const fileExtension = imageFile.name.split('.').pop();
        const imagePath = `products/${sanitizedName}/image.${fileExtension}`;
        
        // Upload new image to organized folder
        const imageRef = ref(storage, imagePath);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        updateData.image = await getDownloadURL(uploadResult.ref);
        
        // Delete old image from storage if it exists and is in a different location
        if (currentProduct.image && 
            currentProduct.image.includes('firebase') && 
            currentProduct.image !== updateData.image) {
          try {
            // Extract the file path from the Firebase Storage URL
            const oldImageUrl = new URL(currentProduct.image);
            const pathMatch = oldImageUrl.pathname.match(/\/o\/(.+?)\?/);
            if (pathMatch) {
              const oldImagePath = decodeURIComponent(pathMatch[1]);
              const oldImageRef = ref(storage, oldImagePath);
              await deleteObject(oldImageRef);
              console.log('Old image deleted successfully from:', oldImagePath);
            }
          } catch (imageError) {
            console.warn('Could not delete old image:', imageError);
          }
        }
        
        // If product name changed, we should also clean up the old folder structure
        if (currentProduct.name?.en && currentProduct.name.en !== productNameEN) {
          const oldSanitizedName = currentProduct.name.en
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          if (oldSanitizedName !== sanitizedName && currentProduct.image && currentProduct.image.includes('firebase')) {
            try {
              // Try to delete from old folder structure if it exists
              const oldImageUrl = new URL(currentProduct.image);
              const pathMatch = oldImageUrl.pathname.match(/\/o\/(.+?)\?/);
              if (pathMatch) {
                const oldPath = decodeURIComponent(pathMatch[1]);
                if (oldPath.startsWith(`products/${oldSanitizedName}/`)) {
                  const oldRef = ref(storage, oldPath);
                  await deleteObject(oldRef);
                  console.log('Old folder image deleted successfully from:', oldPath);
                }
              }
            } catch (imageError) {
              console.warn('Could not delete old folder image:', imageError);
            }
          }
        }
      }
      // If no imageFile provided, check if image should be removed
      else if (productData.image !== undefined) {
        // If image is being set to empty/null, delete the current image from storage
        if (productData.image === '' || productData.image === null) {
          // Delete current image from storage if it exists
          if (currentProduct.image && currentProduct.image.includes('firebase')) {
            try {
              // Extract the file path from the Firebase Storage URL
              const oldImageUrl = new URL(currentProduct.image);
              const pathMatch = oldImageUrl.pathname.match(/\/o\/(.+?)\?/);
              if (pathMatch) {
                const oldImagePath = decodeURIComponent(pathMatch[1]);
                const oldImageRef = ref(storage, oldImagePath);
                await deleteObject(oldImageRef);
                console.log('Image deleted from storage when removing:', oldImagePath);
              }
            } catch (imageError) {
              console.warn('Could not delete image when removing:', imageError);
            }
          }
          
          updateData.image = '';
        } else {
          // Only update image field if explicitly provided in productData
          updateData.image = productData.image;
        }
      }

      updateData.updatedAt = serverTimestamp();

      const docRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(docRef, updateData);
      
      return productId;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(productId) {
    try {
      // Get product data to delete associated image (raw format for admin operations)
      const productDoc = await this.getProductRaw(productId);
      
      // Delete image from storage if it exists
      if (productDoc.image && productDoc.image.includes('firebase')) {
        try {
          // Extract the file path from the Firebase Storage URL
          const imageUrl = new URL(productDoc.image);
          const pathMatch = imageUrl.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const imagePath = decodeURIComponent(pathMatch[1]);
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            console.log('Product image deleted successfully from storage:', imagePath);
            
            // If the image is in the organized folder structure, try to clean up the folder
            // Check if this is the only file in the product folder
            if (imagePath.includes('products/') && imagePath.includes('/image.')) {
              const folderPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
              console.log('Product folder cleaned up:', folderPath);
              // Note: Firebase Storage automatically removes empty folders,
              // so we don't need to manually delete the folder
            }
          }
        } catch (imageError) {
          console.warn('Could not delete product image:', imageError);
        }
      }

      // Delete product document
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// Category CRUD operations
export const categoryService = {
  // Get all categories
  async getAllCategories() {
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get single category
  async getCategory(categoryId) {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Category not found');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Add new category
  async addCategory(categoryData) {
    try {
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Update category
  async updateCategory(categoryId, categoryData) {
    try {
      const updateData = {
        ...categoryData,
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      await updateDoc(docRef, updateData);
      
      return categoryId;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(categoryId) {
    try {
      // Check if category has products
      const productsWithCategory = await productService.getProductsByCategorySimple(categoryId);
      
      if (productsWithCategory.length > 0) {
        throw new Error('Cannot delete category with existing products');
      }

      await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};