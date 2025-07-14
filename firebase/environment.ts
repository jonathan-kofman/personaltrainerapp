// Firebase Environment Configuration
// Update these values with your actual Firebase project credentials

export const FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_API_KEY || "your-api-key-here",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
  };
  
  export const APP_CONFIG = {
    name: process.env.APP_NAME || "TrainerX",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.ENVIRONMENT || "development",
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || "your-google-places-api-key-here"
  };
  
  // Development vs Production settings
  export const isDevelopment = APP_CONFIG.environment === 'development';
  export const isProduction = APP_CONFIG.environment === 'production'; 