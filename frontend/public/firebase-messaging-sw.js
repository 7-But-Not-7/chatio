// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCognLmRfvxvSN_QFDGHRydNMlL6S2U_2A",
    authDomain: "chatio-a3847.firebaseapp.com",
    projectId: "chatio-a3847",
    storageBucket: "chatio-a3847.firebasestorage.app",
    messagingSenderId: "221893017619",
    appId: "1:221893017619:web:e63b390a98eb2e6455ffe6",
    measurementId: "G-DC1JCNS92M"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
