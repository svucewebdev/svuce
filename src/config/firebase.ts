import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyACVbbwHiOCBNHu4G1Vg-SR6FY61EKaiDo",
  authDomain: "svuce-2ef79.firebaseapp.com",
  projectId: "svuce-2ef79",
  storageBucket: "svuce-2ef79.firebasestorage.app",
  messagingSenderId: "852195324332",
  appId: "1:852195324332:web:ec693d63a56e40d8714a09",
  measurementId: "G-QFT29FD2ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
