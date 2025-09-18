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
    image: firebaseProduct.images?.[0] || firebaseProduct.image || '', // Use first image for backward compatibility
    images: firebaseProduct.images || (firebaseProduct.image ? [firebaseProduct.image] : []),
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
  async addProduct(productData, imageFiles = []) {
    try {
      const imageUrls = [];

      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        const productNameEN = productData.name?.en || 'unnamed';
        // Sanitize the product name for use as folder name
        const sanitizedName = productNameEN
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExtension = file.name.split('.').pop();
          const imagePath = `products/${sanitizedName}/image-${i + 1}.${fileExtension}`;

          const imageRef = ref(storage, imagePath);
          const uploadResult = await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(uploadResult.ref);
          imageUrls.push(imageUrl);
        }
      }

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        images: imageUrls,
        // Keep backward compatibility
        image: imageUrls[0] || '',
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
  async updateProduct(productId, productData, imageFiles = []) {
    try {
      let updateData = { ...productData };

      // Get current product data once for all image operations
      const currentProduct = await this.getProductRaw(productId);

      // Handle image update logic
      if (imageFiles && imageFiles.length > 0) {
        const imageUrls = [];

        // Create organized folder structure: products/{productNameEN}/
        const productNameEN = productData.name?.en || currentProduct.name?.en || 'unnamed';
        // Sanitize the product name for use as folder name
        const sanitizedName = productNameEN
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Delete old images from storage first
        const currentImages = currentProduct.images || (currentProduct.image ? [currentProduct.image] : []);
        for (const oldImageUrl of currentImages) {
          if (oldImageUrl && oldImageUrl.includes('firebase')) {
            try {
              const oldUrl = new URL(oldImageUrl);
              const pathMatch = oldUrl.pathname.match(/\/o\/(.+?)\?/);
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
        }

        // Upload new images
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExtension = file.name.split('.').pop();
          const imagePath = `products/${sanitizedName}/image-${i + 1}.${fileExtension}`;

          const imageRef = ref(storage, imagePath);
          const uploadResult = await uploadBytes(imageRef, file);
          const imageUrl = await getDownloadURL(uploadResult.ref);
          imageUrls.push(imageUrl);
        }

        updateData.images = imageUrls;
        updateData.image = imageUrls[0] || ''; // Backward compatibility

        // If product name changed, clean up old folder structure
        if (currentProduct.name?.en && currentProduct.name.en !== productNameEN) {
          const oldSanitizedName = currentProduct.name.en
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          if (oldSanitizedName !== sanitizedName) {
            // Old images should already be deleted above, but clean up any remaining
            console.log('Product renamed, old folder cleaned up:', oldSanitizedName, '->', sanitizedName);
          }
        }
      }
      // If images array is explicitly provided in productData (e.g., reordering existing images)
      else if (productData.images !== undefined) {
        updateData.images = productData.images;
        updateData.image = productData.images?.[0] || ''; // Backward compatibility

        // If images are being removed completely
        if (productData.images.length === 0) {
          // Delete current images from storage
          const currentImages = currentProduct.images || (currentProduct.image ? [currentProduct.image] : []);
          for (const oldImageUrl of currentImages) {
            if (oldImageUrl && oldImageUrl.includes('firebase')) {
              try {
                const oldUrl = new URL(oldImageUrl);
                const pathMatch = oldUrl.pathname.match(/\/o\/(.+?)\?/);
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
          }

          updateData.images = [];
          updateData.image = '';
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
      // Get product data to delete associated images (raw format for admin operations)
      const productDoc = await this.getProductRaw(productId);

      // Delete all images from storage
      const imagesToDelete = productDoc.images || (productDoc.image ? [productDoc.image] : []);

      for (const imageUrl of imagesToDelete) {
        if (imageUrl && imageUrl.includes('firebase')) {
          try {
            // Extract the file path from the Firebase Storage URL
            const url = new URL(imageUrl);
            const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
            if (pathMatch) {
              const imagePath = decodeURIComponent(pathMatch[1]);
              const imageRef = ref(storage, imagePath);
              await deleteObject(imageRef);
              console.log('Product image deleted successfully from storage:', imagePath);
            }
          } catch (imageError) {
            console.warn('Could not delete product image:', imageError);
          }
        }
      }

      // Clean up folder if it follows the organized structure
      if (imagesToDelete.length > 0 && imagesToDelete[0] && imagesToDelete[0].includes('products/')) {
        const firstImageUrl = imagesToDelete[0];
        try {
          const url = new URL(firstImageUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          if (pathMatch) {
            const imagePath = decodeURIComponent(pathMatch[1]);
            if (imagePath.includes('products/') && imagePath.includes('/image-')) {
              const folderPath = imagePath.substring(0, imagePath.lastIndexOf('/'));
              console.log('Product folder cleaned up:', folderPath);
              // Note: Firebase Storage automatically removes empty folders,
              // so we don't need to manually delete the folder
            }
          }
        } catch (error) {
          console.warn('Could not determine folder structure:', error);
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