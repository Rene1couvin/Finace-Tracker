import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-ig3ajpW97JbN48OFJmoyfoUw9YXOi-8",
  authDomain: "finance-login-00001.firebaseapp.com",
  projectId: "finance-login-00001",
  storageBucket: "finance-login-00001.firebasestorage.app",
  messagingSenderId: "239927424778",
  appId: "1:239927424778:web:bc439e8de8f297812fecf3",
  measurementId: "G-DPH2X80SL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
