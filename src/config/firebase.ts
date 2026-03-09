import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDdTHHFclCru3YMo-8oSDtft4tB5hfbZuk",
    authDomain: "svuresults-43737.firebaseapp.com",
    projectId: "svuresults-43737",
    storageBucket: "svuresults-43737.firebasestorage.app",
    messagingSenderId: "408321760255",
    appId: "1:408321760255:web:cccb220542e273c42025ca",
    measurementId: "G-V1ZPWBPL62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
