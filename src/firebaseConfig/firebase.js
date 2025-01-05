import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGT5fp5iXP3FhVeTX7o-4vLZMzSiNGl9o",
  authDomain: "waspwarden-c86f9.firebaseapp.com",
  databaseURL: "https://waspwarden-c86f9-default-rtdb.firebaseio.com",
  projectId: "waspwarden-c86f9",
  storageBucket: "waspwarden-c86f9.firebasestorage.app",
  messagingSenderId: "936843559982",
  appId: "1:936843559982:web:1c2710fd6b80a075ca8bbf",
  measurementId: "G-4863P2FNC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);
export const db = getFirestore(app);