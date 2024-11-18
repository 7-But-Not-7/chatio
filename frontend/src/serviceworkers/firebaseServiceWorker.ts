export const registerFirebaseServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          type: 'module',
        });
        console.log('Firebase Service Worker registered with scope:', registration.scope);
      } catch (error) {
        console.error('Firebase Service Worker registration failed:', error);
      }
    }
  };