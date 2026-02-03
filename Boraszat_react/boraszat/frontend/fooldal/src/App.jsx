import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import BorRendeles from "./pages/BorRendeles.jsx";
import BorKostolas from "./pages/BorKostolas.jsx";
import SignInSide from "./pages/SignInSide.jsx";
import SignUpSide from "./pages/SignUpSide.jsx";
import { AuthProvider } from "./context/AuthContext"; 
import Checkout from './pages/Checkout';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TastingCheckout from "./pages/TastingCheckout.jsx"; // <--- 1. ÚJ IMPORT

import Footer from "./components/footer.jsx"; 

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/borrendeles" element={<BorRendeles />} />
          <Route path="/borkostolas" element={<BorKostolas />} />
          <Route path="/login" element={<SignInSide />} />
          <Route path="/signup" element={<SignUpSide />} />
          <Route path="/checkout" element={<Checkout />} /> 
          
          {/* 2. ÚJ ROUTE A KÓSTOLÓ FOGLALÁSHOZ */}
          <Route path="/kostolo-foglalas" element={<TastingCheckout />} />
          
          <Route path="/admin" element={<AdminDashboard />} />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}