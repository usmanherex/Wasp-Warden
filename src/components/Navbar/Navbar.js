import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../../assets/images/ward.png';
import { Bell, Heart, Trash2, CheckCircle } from 'lucide-react';
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
    <nav className="bg-green-600 w-full shadow-md sticky top-0 z-10">
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
            {getNavigation().map((item, idx) => (
              <li key={idx} className="text-white hover:text-green-200">
                <Link to={item.path} className="block">
                  {item.title}
                </Link>
              </li>
            ))}

            {/* Notifications - Show for both Farmer and Agri-business users */}
            {isLoggedIn && (userType === 'Farmer' || userType === 'Agri-business'|| userType === 'Consumer') && (
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