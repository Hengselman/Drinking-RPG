// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAeMX2u-tZ8Fup-imBEl42rhAvN8qJdfw",
  authDomain: "drinking-rpg.firebaseapp.com",
  projectId: "drinking-rpg",
  storageBucket: "drinking-rpg.firebasestorage.app",
  messagingSenderId: "1013360724277",
  appId: "1:1013360724277:web:0fa1f225c8c6d4675a647c",
  measurementId: "G-W59M6Q3Q8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);