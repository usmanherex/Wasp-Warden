import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

const AppContent = () => {
  const location = useLocation();
  const noNavbarFooterPaths = ['/login', '/signup'];

  return (
    <div>
      {!noNavbarFooterPaths.includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>

      {!noNavbarFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

const Root = () => (
  <Router>
    <AppContent />
  </Router>
);

export default Root;