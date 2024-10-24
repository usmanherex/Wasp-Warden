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
import { MyWarden, PlantDiseaseDetection, WheatDiseaseDetection, PestDetection } from './pages/MyWarden';
import IoTDashboard from './pages/IOTDashboard';

const AppContent = () => {
  const location = useLocation();
  
  // Pages that should show navbar (all except login/signup)
  const showNavbar = !['/login', '/signup'].includes(location.pathname);
  
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
        <Route path="/wheat-disease-detection" element={<WheatDiseaseDetection />} />
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