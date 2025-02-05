import React, { useEffect } from 'react';
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
import CreateProduct from './pages/CreateProduct_Farmer';
import CreateAgriBusinessProduct from './pages/CreateProduct_AgriBusiness';
import ManageProducts from './pages/ManageProducts';
import EditFarmerProduct from './pages/EditProduct_Farmer';
import EditAgriBusinessProduct from './pages/EditProduct_AgriBusiness';
import AIReportsPage from './pages/AiReports';
import UserProfile from './pages/UserProfileThirdPerson';
import NegotiationsPage from './pages/Negotiations';
import OrderHistoryPage from './pages/OrderHistory';

import SavedProductsPage from './pages/SavedProducts';
import Dashboard from './pages/FarmerDashboard';
import PendingOrders from './pages/PendingOrders';
import AgriDashboard from './pages/AgriBusinessDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ConsumerNegotiationsPage from './pages/ConsumerNegotiations';
import PaymentPage from './pages/Payments';
import FinanceDashboard from './pages/FinanceDashboard';
import { NotificationsPage } from './pages/Notifications';
import MartProducts from './pages/martProducts';
import MarketplaceProducts from './pages/marketplaceproducts';
import AboutUs from './pages/About-us';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQSection from './pages/FAQ';
import IoTIntegrationPage from './pages/IoTIntegration';
import BlogLayout from './pages/Blog';
import Article from './pages/Article';
import ReturnPolicy from './pages/Return-Policy';
import ShippingPolicy from './pages/ShippingPolicy';
import CookiePolicy from './pages/Cookie-policy';
import Disclaimer from './pages/Disclaimer';
import IntellectualPropertyPolicy from './pages/IntellectualPropertyPolicy';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};


const AppContent = () => {
  const location = useLocation();
  
  // Pages that should show navbar (all except login/signup)
  const pathname = location.pathname;
const showNavbar = !['/login', '/signup','/forgot-password', '/reset-password'].includes(pathname) && !/^\/reset-password\/[^/]+$/.test(pathname);

  // Pages that should show footer
  const showFooter = ['/', '/home', '/contact','/mart','/marketplace','/my-warden','/farmer-dashboard','/agribusiness-dashboard','/consumer-dashboard','/finances','/privacy-policy','/about-us','/return-policy','/faq','/terms-conditions','/shipping-delivery-policy','/cookie-policy','/disclaimer','/intellectual-property-policy'].includes(location.pathname);

  return (
    <div>
        <ScrollToTop />
       <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
       
      />
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shipping-delivery-policy" element={<ShippingPolicy/>} />
        <Route path="/intellectual-property-policy" element={<IntellectualPropertyPolicy/>} />
        <Route path="/disclaimer" element={<Disclaimer/>} />
        <Route path="/cookie-policy" element={<CookiePolicy/>} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/mart" element={<FarmMarketplace />} />
        <Route path="/marketplace" element={<AgriEquipmentMarketplace />} />
        <Route path="/farmerproducts-mart" element={<MartProducts/>} />
        <Route path="/agribusiness-marketplace" element={<MarketplaceProducts />} />
        <Route path="/my-warden" element={<MyWarden />} />
        <Route path="/iot-dashboard" element={<IoTIntegrationPage />} />
        <Route path="/plant-disease-detection" element={<PlantDiseaseDetection />} />
        <Route path="/pest-detection" element={<PestDetection />} />
        <Route path="/maize-disease-detection" element={<MaizeDiseaseDetection />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/create-product-farmer" element={<CreateProduct />} />
        <Route path="/create-product-agribusiness" element={<CreateAgriBusinessProduct />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/edit-product-farmer/:productId" element={<EditFarmerProduct />} />
        <Route path="/edit-product-agribusiness/:productId" element={<EditAgriBusinessProduct/>} />
        <Route path="/ai-reports/" element={<AIReportsPage/>} />
        <Route path="/user-profile/:userId/" element={<UserProfile/>} />
        <Route path="/negotiations/" element={<NegotiationsPage/>} />
        <Route path="/order-history/:userId" element={<OrderHistoryPage/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/saved-products" element={<SavedProductsPage />} />
        <Route path="/farmer-dashboard" element={<Dashboard />} />
        <Route path="/agribusiness-dashboard" element={<AgriDashboard />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer-negotiations" element={<ConsumerNegotiationsPage />} />
        <Route path="/stripe-payment" element={<PaymentPage />} />
        <Route path="/blog" element={<BlogLayout />} />
       
        <Route path="/finances" element={<FinanceDashboard />} />
        <Route path="/blog/:id"  element={<Article/>} />
       
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