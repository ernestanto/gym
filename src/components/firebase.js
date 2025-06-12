// Import the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Firestore SDK
import { getStorage } from "firebase/storage"; // Firebase Storage SDK

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8bbJRGSDxsMahxyi98-t8uIrrTk8tcM8",
  authDomain: "gymdata-39505.firebaseapp.com",
  projectId: "gymdata-39505",
  storageBucket: "gymdata-39505.firebasestorage.app",
  messagingSenderId: "449860714505",
  appId: "1:449860714505:web:9e47756be6d0dd3dec78d8",
  measurementId: "G-T1KZ8STC0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app); // Check if Firebase initializes correctly

const auth = getAuth(app);  // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firebase services
export { auth, db, storage };


