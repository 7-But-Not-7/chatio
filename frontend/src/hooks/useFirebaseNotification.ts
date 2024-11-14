// src/hooks/useFirebaseNotification.ts
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';

const VAPID_KEY = "BL3jqZPD3LXwRFTo5YK_aXahqUzcAXbF7r-6bR0Stdwyfuv6j3rZjkencAk7wAAalt8EDqGlACyCEnZNxI1-FDI"

const useFirebaseNotification = (vapidKey: string= VAPID_KEY) => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, { vapidKey });
        if (token) {
          console.log('Push notification token:', token);
        }
      } catch (err) {
        console.error('Permission denied', err);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      // Handle incoming messages
      if (payload.notification) {
        alert(`New message: ${payload.notification.body}`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [vapidKey]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Firebase Messaging Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Firebase Messaging Service Worker registration failed:', err);
        });
    }
  }, []);
};

export default useFirebaseNotification;