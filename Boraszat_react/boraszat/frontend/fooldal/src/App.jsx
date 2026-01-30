import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import BorRendeles from "./pages/BorRendeles.jsx";
import BorTura from "./pages/BorTura.jsx";
import SignInSide from "./pages/SignInSide.jsx";
import SignUpSide from "./pages/SignUpSide.jsx";
import { AuthProvider } from "./context/AuthContext"; // Importáld be a contextet!
import Checkout from './pages/Checkout';
import Footer from "./components/footer.jsx"; 

export default function App() {
  return (
    <AuthProvider> {/* Ez teszi lehetővé a belépési adatok elérését mindenhol */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/borrendeles" element={<BorRendeles />} />
          <Route path="/bortura" element={<BorTura />} />
          <Route path="/login" element={<SignInSide />} />
          <Route path="/signup" element={<SignUpSide />} />
          <Route path="/checkout" element={<Checkout />} /> 
        </Route>

        {/* Minden más esetben főoldal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      
      </Routes>
    </AuthProvider>
  );
}