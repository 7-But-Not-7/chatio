import useFirebaseNotification from "./hooks/useFirebaseNotification";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";
import { registerFirebaseServiceWorker } from './serviceworkers/firebaseServiceWorker';

function App() {
  registerFirebaseServiceWorker();
  return (
    <>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </>
  );
}

export default App;
