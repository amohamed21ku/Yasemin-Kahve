// AuthContext.js - Authentication context provider
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, userData = {}) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: userData.displayName || result.user.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        companyName: userData.companyName || '',
        shippingAddress: userData.shippingAddress || '',
        enrolledCourses: [],
        sampleOrders: [],
        createdAt: new Date(),
        lastLogin: new Date(),
        provider: 'email'
      });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date()
      }, { merge: true });

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      let shouldRequestPhone = false;
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || '',
          firstName: result.user.displayName ? result.user.displayName.split(' ')[0] : '',
          lastName: result.user.displayName ? result.user.displayName.split(' ').slice(1).join(' ') : '',
          photoURL: result.user.photoURL || '',
          phoneNumber: '', // Initialize empty phone number
          companyName: '',
          shippingAddress: '',
          enrolledCourses: [],
          sampleOrders: [],
          createdAt: new Date(),
          lastLogin: new Date(),
          provider: 'google'
        });
        shouldRequestPhone = true; // New user should be asked for phone
      } else {
        // Update last login for existing user
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: new Date(),
          photoURL: result.user.photoURL || userDoc.data().photoURL
        }, { merge: true });
        
        // Check if existing user has phone number
        const userData = userDoc.data();
        shouldRequestPhone = !userData.phoneNumber || userData.phoneNumber.trim() === '';
      }

      return { ...result, shouldRequestPhone };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user data from Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (uid, userData) => {
    try {
      setError(null);
      await setDoc(doc(db, 'users', uid), {
        ...userData,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check if user is admin
  const isUserAdmin = async (uid) => {
    try {
      const userData = await getUserData(uid);
      return userData?.isAdmin || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Set user as admin (only for development/setup)
  const setUserAsAdmin = async (uid, isAdmin = true) => {
    try {
      setError(null);
      await setDoc(doc(db, 'users', uid), {
        isAdmin: isAdmin,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    getUserData,
    updateUserProfile,
    isUserAdmin,
    setUserAsAdmin,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};