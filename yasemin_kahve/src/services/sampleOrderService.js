import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'sampleOrders';

export const sampleOrderService = {
  // Create a new sample order
  async createSampleOrder(orderData) {
    try {
      console.log('sampleOrderService - Creating order with data:', orderData);
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const createdOrder = {
        id: docRef.id,
        ...orderData
      };
      console.log('sampleOrderService - Order created successfully:', createdOrder);
      return createdOrder;
    } catch (error) {
      console.error('Error creating sample order:', error);
      throw error;
    }
  },

  // Get all sample orders (admin)
  async getAllSampleOrders() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return orders;
    } catch (error) {
      console.error('Error fetching sample orders:', error);
      throw error;
    }
  },

  // Get sample orders for a specific user
  async getUserSampleOrders(userId) {
    try {
      console.log('sampleOrderService - Fetching orders for userId:', userId);
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders = [];

      querySnapshot.forEach((doc) => {
        const orderData = {
          id: doc.id,
          ...doc.data()
        };
        console.log('sampleOrderService - Found order:', orderData);
        orders.push(orderData);
      });

      console.log('sampleOrderService - Total orders found:', orders.length);
      return orders;
    } catch (error) {
      console.error('Error fetching user sample orders:', error);
      throw error;
    }
  },

  // Get sample orders by order IDs (alternative method for user profile)
  async getSampleOrdersByIds(orderIds) {
    try {
      if (!orderIds || orderIds.length === 0) {
        return [];
      }

      console.log('sampleOrderService - Fetching orders by IDs:', orderIds);
      const orders = [];

      // Firebase 'in' query has a limit of 10, so we batch if needed
      const batchSize = 10;
      for (let i = 0; i < orderIds.length; i += batchSize) {
        const batch = orderIds.slice(i, i + batchSize);
        const q = query(
          collection(db, COLLECTION_NAME),
          where('__name__', 'in', batch)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          orders.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }

      // Sort by creation date, newest first
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      console.log('sampleOrderService - Orders fetched by IDs:', orders.length);
      return orders;
    } catch (error) {
      console.error('Error fetching sample orders by IDs:', error);
      throw error;
    }
  },

  // Update sample order status
  async updateOrderStatus(orderId, status, adminNote = '') {
    try {
      const orderRef = doc(db, COLLECTION_NAME, orderId);
      await updateDoc(orderRef, {
        status,
        adminNote,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete sample order
  async deleteSampleOrder(orderId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, orderId));
      return true;
    } catch (error) {
      console.error('Error deleting sample order:', error);
      throw error;
    }
  },

  // Listen to sample orders changes (real-time)
  subscribeSampleOrders(callback, filters = {}) {
    let q = collection(db, COLLECTION_NAME);

    // Add filters if provided
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Always order by creation date
    q = query(q, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(orders);
    });
  },

  // Update user profile with sample order info
  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

export default sampleOrderService;