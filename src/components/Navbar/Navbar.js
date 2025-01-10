import React, { useState, useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../../assets/images/ward.png';
import { Bell,Heart } from 'lucide-react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    setUserType(user?.userType || '');
  
  const mockNotifications = [
    {
      id: 1,
      text: "New order #123 has been placed in your mart. Check it out!",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: 2,
      text: "Your IoT device 'Garden Sensor' detected unusual activity.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: 3,
      text: "Welcome bonus: 20% off on your next purchase in the marketplace!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false
    },
    {
      id: 4,
      text: "Your monthly Warden report is ready. View your statistics now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true
    },
    {
      id: 5,
      text: "New message from Support regarding your recent inquiry.",
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: true
    }
  ];

  setNotifications(mockNotifications);
  setUnreadCount(mockNotifications.filter(n => !n.read).length);
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserType('');
    navigate('/login');
  };
  const handleViewAllNotifications = () => {
    setIsNotificationOpen(false); // Close the dropdown
    navigate('/notifications'); // Navigate to notifications page
  };
  const farmerNavigation = [
    { title: "Dashboard", path: "/farmer-dashboard" },
    { title: "Marketplace", path: "/marketplace" },
    { title: "Inbox", path: "/inbox" },
    { title: "My Warden", path: "/my-warden" },
    { title: "IoT Insights", path: "/iot-dashboard" },
    { title: "Cart", path: "/cart" },
  ];

  const publicNavigation = [
    { title: "Home", path: "/home" },
    { title: "Contact", path: "/contact" },
    { title: "About us", path: "/about-us" },
  ];
  //const navigation = [
   // { title: "Home", path: "/home" },
  //  { title: "Mart", path: "/mart" },
  //{ title: "Dashboard", path: "/farmer-dashboard" },
  //  { title: "Marketplace", path: "/marketplace" },
 
   // { title: "Inbox", path: "/inbox" },
   // { title: "My Warden", path: "/my-warden" },
   // { title: "IoT Insights", path: "/iot-dashboard" },
   // { title: "Cart", path: "/cart" },
   // { title: "My Profile", path: "/profile" },
   // { title: "Contact", path: "/contact" },
    
    
  //];
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)}h ago`;
    return `${Math.floor(minutes/1440)}d ago`;
  };
  return (
    <nav className="bg-green-600 w-full shadow-md">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-4 md:block">
          <Link to="/" className="flex items-center">
            <img src={Image} alt="Logo" className="h-10 md:h-12" />
            <span className="ml-2 text-xl font-bold text-white">Wasp Warden</span>
          </Link>
          <div className="md:hidden">
            <button
              className="text-white hover:text-green-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {isLoggedIn && userType === 'Farmer' ? (
              // Farmer navigation items
              farmerNavigation.map((item, idx) => (
                <li key={idx} className="text-white hover:text-green-200">
                  <Link to={item.path} className="block">
                    {item.title}
                  </Link>
                </li>
              ))
            ) : !isLoggedIn ? (
              // Public navigation items
              publicNavigation.map((item, idx) => (
                <li key={idx} className="text-white hover:text-green-200">
                  <Link to={item.path} className="block">
                    {item.title}
                  </Link>
                </li>
              ))
            ) : null}

            {/* Notifications - Only show for logged in Farmer */}
            {isLoggedIn && userType === 'Farmer' && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-white hover:text-green-200"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                              !notification.read ? 'bg-green-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button
                          onClick={handleViewAllNotifications}
                          className="block w-full text-center text-sm text-green-600 hover:text-green-700"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authentication buttons */}
            <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link to="/login" className="block py-2 px-4 text-center text-white bg-green-700 hover:bg-green-800 rounded-md shadow transition duration-300">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="block py-2 px-4 text-center text-white bg-green-700 hover:bg-green-800 rounded-md shadow transition duration-300">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button 
                    onClick={handleLogout}
                    className="block py-2 px-4 text-center text-white bg-green-700 hover:bg-green-800 rounded-md shadow transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;