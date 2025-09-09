// courseService.js - Firebase services for course management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  arrayUnion, 
  arrayRemove,
  increment 
} from 'firebase/firestore';
import { db } from '../firebase';
import { deleteCourseFiles } from './courseStorageService';

const COURSES_COLLECTION = 'courses';
const ENROLLMENTS_COLLECTION = 'enrollments';

// Course Management Functions
export const createCourse = async (courseData) => {
  try {
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
      enrolledStudents: [],
      totalEnrollments: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const coursesQuery = query(
      collection(db, COURSES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(coursesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Course not found');
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    // First get the course data to know which files to delete
    const courseData = await getCourseById(courseId);
    
    // Delete all associated files from Firebase Storage
    await deleteCourseFiles(courseId, courseData);
    
    // Delete related enrollments
    const enrollments = await getCourseEnrollments(courseId);
    const enrollmentDeletions = enrollments.map(enrollment => 
      deleteDoc(doc(db, ENROLLMENTS_COLLECTION, enrollment.id))
    );
    await Promise.all(enrollmentDeletions);
    
    // Finally delete the course document from Firestore
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    await deleteDoc(docRef);
    
    console.log(`Course ${courseId} and all associated data deleted successfully`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Enrollment Management Functions
export const enrollStudent = async (courseId, userId, paymentInfo) => {
  try {
    // Create enrollment record
    const enrollmentData = {
      courseId,
      userId,
      enrolledAt: new Date(),
      paymentStatus: 'completed',
      paymentInfo: {
        amount: paymentInfo.amount,
        currency: 'TRY',
        method: paymentInfo.method,
        transactionId: `test_${Date.now()}` // For development
      },
      progress: 0,
      completedLessons: [],
      status: 'active'
    };
    
    const enrollmentRef = await addDoc(collection(db, ENROLLMENTS_COLLECTION), enrollmentData);
    
    // Update course with new enrollment
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, {
      enrolledStudents: arrayUnion(userId),
      totalEnrollments: increment(1)
    });
    
    // Update user's enrolled courses
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      enrolledCourses: arrayUnion(courseId)
    });
    
    return enrollmentRef.id;
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
};

export const getStudentEnrollments = async (userId) => {
  try {
    const enrollmentsQuery = query(
      collection(db, ENROLLMENTS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(enrollmentsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    throw error;
  }
};

export const getCourseEnrollments = async (courseId) => {
  try {
    const enrollmentsQuery = query(
      collection(db, ENROLLMENTS_COLLECTION),
      where('courseId', '==', courseId)
    );
    const querySnapshot = await getDocs(enrollmentsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

export const getAllEnrollments = async () => {
  try {
    const enrollmentsQuery = query(
      collection(db, ENROLLMENTS_COLLECTION),
      orderBy('enrolledAt', 'desc')
    );
    const querySnapshot = await getDocs(enrollmentsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all enrollments:', error);
    throw error;
  }
};

export const updateEnrollmentProgress = async (enrollmentId, progress, completedLesson = null) => {
  try {
    const updateData = {
      progress,
      updatedAt: new Date()
    };
    
    if (completedLesson) {
      updateData.completedLessons = arrayUnion(completedLesson);
    }
    
    const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
    await updateDoc(enrollmentRef, updateData);
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    throw error;
  }
};

export const cancelEnrollment = async (enrollmentId, courseId, userId) => {
  try {
    // Update enrollment status
    const enrollmentRef = doc(db, ENROLLMENTS_COLLECTION, enrollmentId);
    await updateDoc(enrollmentRef, {
      status: 'cancelled',
      cancelledAt: new Date()
    });
    
    // Remove from course
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(courseRef, {
      enrolledStudents: arrayRemove(userId),
      totalEnrollments: increment(-1)
    });
    
    // Remove from user's enrolled courses
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      enrolledCourses: arrayRemove(courseId)
    });
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    throw error;
  }
};

// Utility Functions
export const isStudentEnrolled = async (courseId, userId) => {
  try {
    const enrollmentsQuery = query(
      collection(db, ENROLLMENTS_COLLECTION),
      where('courseId', '==', courseId),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(enrollmentsQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
};

export const getCourseStats = async (courseId) => {
  try {
    const enrollments = await getCourseEnrollments(courseId);
    const activeEnrollments = enrollments.filter(e => e.status === 'active');
    const completedEnrollments = enrollments.filter(e => e.progress === 100);
    const averageProgress = activeEnrollments.length > 0 
      ? activeEnrollments.reduce((sum, e) => sum + e.progress, 0) / activeEnrollments.length 
      : 0;
    
    return {
      totalEnrollments: enrollments.length,
      activeEnrollments: activeEnrollments.length,
      completedEnrollments: completedEnrollments.length,
      averageProgress: Math.round(averageProgress),
      revenue: enrollments.reduce((sum, e) => sum + (e.paymentInfo?.amount || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching course stats:', error);
    throw error;
  }
};