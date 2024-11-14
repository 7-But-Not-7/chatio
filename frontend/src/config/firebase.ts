import { FirebaseOptions, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCognLmRfvxvSN_QFDGHRydNMlL6S2U_2A",
  authDomain: "chatio-a3847.firebaseapp.com",
  projectId: "chatio-a3847",
  storageBucket: "chatio-a3847.firebasestorage.app",
  messagingSenderId: "221893017619",
  appId: "1:221893017619:web:e63b390a98eb2e6455ffe6",
  measurementId: "G-DC1JCNS92M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };