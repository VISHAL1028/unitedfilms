// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwP2RhO8oPeqwDD-Xo3_QeI9YOhZ13x0k",
  authDomain: "unitedfilms-525dc.firebaseapp.com",
  projectId: "unitedfilms-525dc",
  storageBucket: "unitedfilms-525dc.firebasestorage.app",
  messagingSenderId: "610504729167",
  appId: "1:610504729167:web:d8027611e380d1d7eec03a",
  measurementId: "G-M0QEZQGLS9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);