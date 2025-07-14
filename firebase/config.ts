import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from './environment';

// Initialize Firebase with environment configuration
export const app = initializeApp(FIREBASE_CONFIG);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
// This allows the app to work offline and sync when online
// db.settings({
//   cacheSizeBytes: CACHE_SIZE_UNLIMITED,
// });

console.log('Firebase initialized successfully'); 