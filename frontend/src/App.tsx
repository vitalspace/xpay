// App.tsx
import { Routes, Route, Outlet } from "react-router-dom";
import { Landing } from "./pages/Landing.tsx";
import { SendPayment } from "./pages/SendPayment.tsx";
import { GeneratePayment } from "./pages/GeneratePayment.tsx";
import { CreatePost } from "./pages/CreatePost.tsx";
import { PayRequest } from "./pages/PayRequest.tsx";
import { PostView } from "./pages/PostView.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Menu } from "./components/ui/Menu.tsx";
import { Footer } from "./components/ui/Footer.tsx";
import { Guardian } from "./components/ui/Guardian.tsx";
const AppLayout: React.FC = () => (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
    {/* Header - Colorido y vibrante */}
    <Menu />
    <Outlet />
    {/* Footer - Colorido */}
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/send-payment" element={
          <Guardian>
            <SendPayment />
          </Guardian>
        } />
        <Route path="/generate-payment" element={
          <Guardian>
            <GeneratePayment />
          </Guardian>
        } />
        <Route path="/x402-protection" element={
          <Guardian>
            <CreatePost />
          </Guardian>
        } />
        <Route path="/pay/:paymentRequestId" element={
          <Guardian>
            <PayRequest />
          </Guardian>
        } />
        <Route path="/post/:postId" element={
          <Guardian>
            <PostView />
          </Guardian>
        } />
        <Route path="/dashboard" element={
          <Guardian>
            <Dashboard />
          </Guardian>
        } />
      </Route>
    </Routes>
  );
}

export default App;
