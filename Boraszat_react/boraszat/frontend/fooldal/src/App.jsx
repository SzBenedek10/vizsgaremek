import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import BorRendeles from "./pages/BorRendeles.jsx";
import BorTura from "./pages/BorTura.jsx";
import SignInSide from "./pages/SignInSide.jsx";
import SignUpSide from "./pages/SignUpSide.jsx";
import AdminUsers from "./pages/AdminUsers.jsx"; // Az előbb készített MUI táblázatos oldal
import AdminRoute from "./components/AdminRoute.jsx"; // A védelmi vonal
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/footer.jsx"; 

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/borrendeles" element={<BorRendeles />} />
          <Route path="/bortura" element={<BorTura />} />
          <Route path="/login" element={<SignInSide />} />
          <Route path="/signup" element={<SignUpSide />} />

          {/* Védett Admin útvonal */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}