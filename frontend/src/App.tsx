import useFirebaseNotification from "./hooks/useFirebaseNotification";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";

function App() {
  useFirebaseNotification();
  return (
    <>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </>
  );
}

export default App;
