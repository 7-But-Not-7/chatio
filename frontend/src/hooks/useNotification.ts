// src/hooks/useNotification.ts
import { useEffect } from 'react';

const useNotification = () => {
  useEffect(() => {
    // Request notification permission
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((_registration) => {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            // You can now subscribe to push notifications here
          }
        });
      });
    }
  }, []);

};

export default useNotification;
