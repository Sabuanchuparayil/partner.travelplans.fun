
// FIX: Switched to Firebase v9 initialization to support modular Firestore while maintaining v8 compat for Auth.
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// Import v8 compat libraries for AuthContext.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// IMPORTANT: Replace with your app's Firebase project configuration.
// You can get this from the Firebase Console > Project Settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase with the v9 modular SDK.
// This single initialization is used by all Firebase services, including compat layers.
const app = initializeApp(firebaseConfig);

// Initialize and export v9 modular Firestore.
// It correctly uses the v9 `app` instance.
export const db = getFirestore(app);

// Initialize and export v8 compat Auth.
// The compat library attaches to the app instance initialized above.
export const auth = firebase.auth();
