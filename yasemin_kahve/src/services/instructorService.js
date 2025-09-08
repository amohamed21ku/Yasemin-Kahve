// instructorService.js - Firebase services for instructor management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

const INSTRUCTORS_COLLECTION = 'instructors';

// Instructor Management Functions
export const createInstructor = async (instructorData) => {
  try {
    const docRef = await addDoc(collection(db, INSTRUCTORS_COLLECTION), {
      ...instructorData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating instructor:', error);
    throw error;
  }
};

export const getAllInstructors = async () => {
  try {
    const instructorsQuery = query(
      collection(db, INSTRUCTORS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(instructorsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

export const getInstructorById = async (instructorId) => {
  try {
    const docRef = doc(db, INSTRUCTORS_COLLECTION, instructorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Instructor not found');
    }
  } catch (error) {
    console.error('Error fetching instructor:', error);
    throw error;
  }
};

export const updateInstructor = async (instructorId, instructorData) => {
  try {
    const docRef = doc(db, INSTRUCTORS_COLLECTION, instructorId);
    await updateDoc(docRef, {
      ...instructorData,
      updatedAt: new Date()
    });
    return instructorId;
  } catch (error) {
    console.error('Error updating instructor:', error);
    throw error;
  }
};

export const deleteInstructor = async (instructorId) => {
  try {
    const docRef = doc(db, INSTRUCTORS_COLLECTION, instructorId);
    await deleteDoc(docRef);
    return instructorId;
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};