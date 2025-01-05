import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import CartPage from './pages/Cart';
import InboxPage from './pages/Inbox';
import ContactForm from './pages/Contact';
import FarmMarketplace from './pages/Mart';
import AgriEquipmentMarketplace from './pages/MarketPlace';
import { MyWarden, PlantDiseaseDetection, MaizeDiseaseDetection, PestDetection } from './pages/MyWarden';
import IoTDashboard from './pages/IOTDashboard';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

const AppContent = () => {
  const location = useLocation();
  
  // Pages that should show navbar (all except login/signup)
  const pathname = location.pathname;
const showNavbar = !['/login', '/signup','/forgot-password', '/reset-password'].includes(pathname) && !/^\/reset-password\/[^/]+$/.test(pathname);

  // Pages that should show footer
  const showFooter = ['/', '/home', '/contact','/mart','/marketplace'].includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/mart" element={<FarmMarketplace />} />
        <Route path="/marketplace" element={<AgriEquipmentMarketplace />} />
        <Route path="/my-warden" element={<MyWarden />} />
        <Route path="/iot-dashboard" element={<IoTDashboard />} />
        <Route path="/plant-disease-detection" element={<PlantDiseaseDetection />} />
        <Route path="/pest-detection" element={<PestDetection />} />
        <Route path="/maize-disease-detection" element={<MaizeDiseaseDetection />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
};

const Root = () => (
  <Router>
    <AppContent />
  </Router>
);

export default Root;