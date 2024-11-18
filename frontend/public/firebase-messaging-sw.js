// public/firebase-messaging-sw.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js';


const firebaseConfig = {
  apiKey: 'AIzaSyCognLmRfvxvSN_QFDGHRydNMlL6S2U_2A',
  authDomain: 'chatio-a3847.firebaseapp.com',
  projectId: 'chatio-a3847',
  storageBucket: 'chatio-a3847.appspot.com',
  messagingSenderId: '221893017619',
  appId: '1:221893017619:web:e63b390a98eb2e6455ffe6',
  measurementId: 'G-DC1JCNS92M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[Service Worker] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
