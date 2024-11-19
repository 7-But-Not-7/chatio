// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }

firebase.initializeApp({
  apiKey: "AIzaSyCognLmRfvxvSN_QFDGHRydNMlL6S2U_2A",
  authDomain: "chatio-a3847.firebaseapp.com",
  projectId: "chatio-a3847",
  storageBucket: "chatio-a3847.firebasestorage.app",
  messagingSenderId: "221893017619",
  appId: "1:221893017619:web:e63b390a98eb2e6455ffe6",
  measurementId: "G-DC1JCNS92M"
  })

const initMessaging = firebase.messaging()