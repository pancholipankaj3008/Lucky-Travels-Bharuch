
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import AdminLogin from "./pages/Adminlogin";
import AdminCars from "./pages/Admincars";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import OurCars from "./pages/OurCars";

import "./index.css";

function AdminGate() {
  const location = useLocation();
  const [state, setState] = useState('checking');
  useEffect(() => {
    api.getAdminSession().then(() => setState('ready')).catch((error) => {
      if (error.status === 401) setState('login');
      else setState('error');
    });
  }, []);
  if (state === 'checking') return <p className="p-10 text-center">Checking admin session...</p>;
  if (state === 'login') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (state === 'error') return <p className="p-10 text-center">Server se connect nahi ho pa raha. Please refresh karke try karein.</p>;
  return <AdminCars />;
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      <Routes><Route path="/admin/*" element={null} /><Route path="*" element={<Navbar />} /></Routes>

      <main className="min-h-[300px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cars" element={<OurCars />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/cars" element={<AdminGate />} />
          <Route path="/admin" element={<Navigate to="/admin/cars" replace />} />
        </Routes>
      </main>

      <Routes><Route path="/admin/*" element={null} /><Route path="*" element={<Footer />} /></Routes>
    </div>
  );
}

export default App;
