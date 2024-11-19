import { requestForToken } from "./config/firebase";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";

function App() {
  requestForToken();
  return (
    <>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </>
  );
}

export default App;
