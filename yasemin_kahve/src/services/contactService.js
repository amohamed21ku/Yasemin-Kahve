import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const CONTACT_MESSAGES_COLLECTION = 'contactMessages';

export const contactService = {
  // Submit a new contact message
  async submitMessage(messageData) {
    try {
      const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
        firstName: messageData.firstName,
        lastName: messageData.lastName,
        email: messageData.email,
        phone: messageData.phone,
        company: messageData.company || '',
        inquiryType: messageData.inquiryType,
        message: messageData.message,
        status: 'unread', // unread, read, archived
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }
  },

  // Get all contact messages (for admin)
  async getAllMessages() {
    try {
      const q = query(
        collection(db, CONTACT_MESSAGES_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  },

  // Get single message
  async getMessage(messageId) {
    try {
      const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Message not found');
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  },

  // Update message status
  async updateMessageStatus(messageId, status) {
    try {
      const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, messageId);
      await updateDoc(docRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      return messageId;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  },

  // Delete message
  async deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, CONTACT_MESSAGES_COLLECTION, messageId));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
