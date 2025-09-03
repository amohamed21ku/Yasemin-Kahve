// useEnrollment.js - Hook for managing course enrollments
import { useState } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export const useEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const enrollInCourse = async (courseId, courseTitle, coursePrice) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to enroll in courses');
    }

    try {
      setLoading(true);
      setError(null);

      // Check if user is already enrolled
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      if (userData?.enrolledCourses?.some(enrollment => enrollment.courseId === courseId)) {
        throw new Error('You are already enrolled in this course');
      }

      // Create enrollment record (omit undefined fields)
      const enrollmentData = {
        courseId,
        enrolledAt: new Date(),
        status: 'active',
        paymentStatus: 'pending', // In a real app, this would be 'pending' until payment is processed
        courseTitle
      };
      if (coursePrice !== undefined && coursePrice !== null) {
        enrollmentData.coursePrice = coursePrice;
      }

      // Add enrollment to user document
      await updateDoc(doc(db, 'users', currentUser.uid), {
        enrolledCourses: arrayUnion(enrollmentData),
        updatedAt: new Date()
      });

      // In a real application, you might also want to:
      // 1. Update course enrollment count
      // 2. Send confirmation email
      // 3. Process payment
      // 4. Add to enrollment collection for better querying

      return { success: true, enrollment: enrollmentData };

    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId) => {
    if (!currentUser) return false;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      return userData?.enrolledCourses?.some(enrollment => 
        enrollment.courseId === courseId && enrollment.status === 'active'
      ) || false;
    } catch (err) {
      console.error('Error checking enrollment status:', err);
      return false;
    }
  };

  const getUserEnrollments = async () => {
    if (!currentUser) return [];

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      
      return userData?.enrolledCourses || [];
    } catch (err) {
      console.error('Error fetching user enrollments:', err);
      return [];
    }
  };

  return {
    enrollInCourse,
    checkEnrollmentStatus,
    getUserEnrollments,
    loading,
    error,
    setError
  };
};