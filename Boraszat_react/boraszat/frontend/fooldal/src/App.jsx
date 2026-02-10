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
import TastingCheckout from "./pages/TastingCheckout.jsx"; 
import Contact  from "./pages/contact.jsx";
import Terms from "./pages/Terms.jsx";       
import Privacy from "./pages/Privacy.jsx";   
import Shipping from "./pages/Shipping.jsx";  
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
          
          <Route path="/kostolo-foglalas" element={<TastingCheckout />} />
          <Route path="/kapcsolat" element={<Contact />} />
          <Route path="/aszf" element={<Terms />} />
          <Route path="/adatvedelem" element={<Privacy />} />
          <Route path="/szallitas" element={<Shipping />} />


          <Route path="/admin" element={<AdminDashboard />} />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}