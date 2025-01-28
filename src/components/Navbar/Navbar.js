import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../../assets/images/ward.png';
import { Bell, Heart, Trash2, CheckCircle ,X,Menu} from 'lucide-react';
import axios from 'axios';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  
  const fetchNotifications = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.userId;
      if (!userId) return;

      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      const { notifications, unread_count } = response.data;
      setNotifications(notifications);
      setUnreadCount(unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    setUserType(user?.userType || '');

    if (token && user) {
      fetchNotifications();
      // Set up polling for notifications
      const interval = setInterval(fetchNotifications, 1000); // every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
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
    setIsNotificationOpen(false);
    navigate('/notifications');
  };
  const handleMarkAsRead = async (notificationId) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.userId;
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read/${userId}`);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.userId;
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}/${userId}`);
      await fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };


  const farmerNavigation = [
    { title: "Dashboard", path: "/farmer-dashboard" },
    { title: "Mart", path: "/mart" },
    { title: "Marketplace", path: "/marketplace" },
    { title: "Inbox", path: "/inbox" },
    { title: "My Warden", path: "/my-warden" },
    { title: "IoT Insights", path: "/iot-dashboard" },
    { title: "Cart", path: "/cart" },
  ];

  const AgribusinessNavigation = [
    { title: "Dashboard", path: "/agribusiness-dashboard" },
    { title: "Marketplace", path: "/marketplace" },
    { title: "Inbox", path: "/inbox" }
  ];
  const ConsumerNavigation = [
    { title: "Dashboard", path: "/consumer-dashboard" },
    { title: "Mart", path: "/mart" },
    { title: "Inbox", path: "/inbox" },
    { title: "Cart", path: "/cart" },
  ];
  const publicNavigation = [
    { title: "Home", path: "/home" },
    { title: "Contact", path: "/contact" },
    { title: "About us", path: "/about-us" },
  ];
  const formatTime = (timestamp) => {
    // Parse the timestamp (Fri, 17 Jan 2025 18:17:42 GMT)
    const timestampDate = new Date(timestamp);
  
    // Extract values from the timestamp
    const tsDay = timestampDate.getUTCDate();
    const tsMonth = timestampDate.getUTCMonth();
    const tsYear = timestampDate.getUTCFullYear();
    const tsHours = timestampDate.getUTCHours();
    const tsMinutes = timestampDate.getUTCMinutes();
    const tsSeconds = timestampDate.getUTCSeconds();
  
    // Get the current date
    const currentDate = new Date();
  
    // Extract local values from the current date
    const currDay = currentDate.getDate();
    const currMonth = currentDate.getMonth();
    const currYear = currentDate.getFullYear();
    const currHours = currentDate.getHours();
    const currMinutes = currentDate.getMinutes();
    const currSeconds = currentDate.getSeconds();
  
    // Calculate differences for each unit
    let yearDiff = currYear - tsYear;
    let monthDiff = currMonth - tsMonth;
    let dayDiff = currDay - tsDay;
    let hourDiff = currHours - tsHours;
    let minuteDiff = currMinutes - tsMinutes;
    let secondDiff = currSeconds - tsSeconds;
  
    // Adjust for negative differences
    if (secondDiff < 0) {
      secondDiff += 60;
      minuteDiff--;
    }
    if (minuteDiff < 0) {
      minuteDiff += 60;
      hourDiff--;
    }
    if (hourDiff < 0) {
      hourDiff += 24;
      dayDiff--;
    }
    if (dayDiff < 0) {
      // Approximate days in month (can be improved with exact month lengths)
      dayDiff += 30;
      monthDiff--;
    }
    if (monthDiff < 0) {
      monthDiff += 12;
      yearDiff--;
    }
  
    // Convert all to total values for comparison
    const totalMonths = yearDiff * 12 + monthDiff;
    const totalHours = dayDiff * 24 + hourDiff;
    const totalMinutes = totalHours * 60 + minuteDiff;
    const totalSeconds = totalMinutes * 60 + secondDiff;
  
    // Determine the most appropriate unit to display
    if (yearDiff > 0) {
      return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
    } else if (totalMonths > 0) {
      return `${totalMonths} month${totalMonths > 1 ? 's' : ''} ago`;
    } else if (dayDiff > 0) {
      return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
    } else if (hourDiff > 0) {
      return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
    } else if (minuteDiff > 0) {
      return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
    } else {
      return `${secondDiff} second${secondDiff > 1 ? 's' : ''} ago`;
    }
  };


  // Helper function to determine which navigation to use
  const getNavigation = () => {
    if (!isLoggedIn) return publicNavigation;
    if (userType === 'Farmer') return farmerNavigation;
    if (userType === 'Agri-business') return AgribusinessNavigation;
    if (userType === 'Consumer') return ConsumerNavigation;
    return publicNavigation;
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Brand - Fixed width */}
          <div className="flex-shrink-0 flex items-center w-64">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={Image}
                alt="Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold text-white tracking-tight hover:text-green-100 transition-colors whitespace-nowrap">
                Wasp Warden
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered with flex-grow */}
          <div className="hidden md:flex flex-grow justify-center items-center">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {getNavigation().map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="text-white text-base lg:text-lg font-medium whitespace-nowrap px-2 lg:px-3 py-2 cursor-pointer group relative transition-all duration-300 hover:bg-green-800 rounded-lg"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons & Notifications - Fixed width */}
          <div className="hidden md:flex items-center w-64 justify-end space-x-4">
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-3 text-white hover:text-green-200 transition-colors group"
              >
                <Bell size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-sm text-gray-500">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.notificationID}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                              notification.status === 'unread' ? 'bg-green-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">{notification.text}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTime(notification.timestamp)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-2">
                                {notification.status === 'unread' && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.notificationID)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(notification.notificationID)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications
                        </div>
                      )}
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
            
            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-800 hover:bg-green-900 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-green-800 bg-white hover:bg-green-50 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-green-800 hover:bg-green-900 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-200 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {getNavigation().map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="block px-4 py-3 text-base font-medium text-white hover:text-green-200 hover:bg-green-800 rounded-md transition-all duration-300"
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn ? (
            <div className="space-y-2 pt-4">
              <Link
                to="/login"
                className="block w-full px-4 py-3 text-center text-white bg-green-800 hover:bg-green-900 rounded-md transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full px-4 py-3 text-center text-green-800 bg-white hover:bg-green-50 rounded-md transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full mt-4 px-4 py-3 text-center text-white bg-green-800 hover:bg-green-900 rounded-md transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;