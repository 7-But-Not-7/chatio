import { FirebaseOptions, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const VAPID_KEY = "BL3jqZPD3LXwRFTo5YK_aXahqUzcAXbF7r-6bR0Stdwyfuv6j3rZjkencAk7wAAalt8EDqGlACyCEnZNxI1-FDI";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
initializeApp(firebaseConfig);
const messaging = getMessaging();

const updateLocalStorageToken = (token: string) => {
  const storedToken = localStorage.getItem('fcmToken');
  if (storedToken !== token) {
    localStorage.setItem('fcmToken', token);
  }
};

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      updateLocalStorageToken(currentToken);
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};
