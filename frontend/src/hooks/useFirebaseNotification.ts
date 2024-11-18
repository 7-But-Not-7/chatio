// src/hooks/useFirebaseNotification.ts
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';

const VAPID_KEY = "BL3jqZPD3LXwRFTo5YK_aXahqUzcAXbF7r-6bR0Stdwyfuv6j3rZjkencAk7wAAalt8EDqGlACyCEnZNxI1-FDI"

const useFirebaseNotification = (vapidKey: string= VAPID_KEY) => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken) {
          console.log('Firebase Push Token:', currentToken);
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token.', error);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      if (payload.notification) {
        alert(`New message: ${payload.notification.body}`);
      }
    });

    return () => unsubscribe();
  }, [vapidKey]);
};

export default useFirebaseNotification;
