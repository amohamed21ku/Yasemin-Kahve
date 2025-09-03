// firebase.js - Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCkeKgHYBnXs5ztyZwlMPxFN9E74fZA-IM",
  authDomain: "coffeeacademy-1703.firebaseapp.com",
  projectId: "coffeeacademy-1703",
  storageBucket: "coffeeacademy-1703.firebasestorage.app",
  messagingSenderId: "246047800339",
  appId: "1:246047800339:web:4fa8b21691cb70ebe1d3e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;