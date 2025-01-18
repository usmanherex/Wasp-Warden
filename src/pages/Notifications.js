import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Trash2, MessageSquare, PackageCheck, Package, Truck, Scale, ThumbsUp, ThumbsDown, ShoppingBag, FileBarChart, Tag, Store, RefreshCcw, MailWarning } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const api = {
  getNotifications: async (userId) => {
    const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
    return response.data;
  },
  markAsRead: async (notificationId, userId) => {
    const response = await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read/${userId}`);
    return response.data;
  },
  deleteNotification: async (notificationId, userId) => {
    const response = await axios.delete(`http://localhost:5000/api/notifications/${notificationId}/${userId}`);
    return response.data;
  }
};
export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = JSON.parse(localStorage.getItem('user'))?.userId;

  const fetchNotifications = async () => {
    try {
      const { notifications, unread_count } = await api.getNotifications(userId);
      console.log(notifications);
      setNotifications(notifications);
      setUnreadCount(unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.markAsRead(notificationId, userId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.deleteNotification(notificationId, userId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => n.status === 'unread');
      await Promise.all(
        unreadNotifications.map(n => api.markAsRead(n.notificationID, userId))
      );
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => n.status === 'unread');
      case 'read':
        return notifications.filter(n => n.status === 'read');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MessageSquare':
        return <MessageSquare className="text-blue-600" size={20} />;
      case 'CheckCircle':
          return <CheckCircle className="text-green-600" size={20}/>;
      case 'PackageCheck':
          return <PackageCheck className="text-blue-600" size={20} />;
      case 'Package':
          return <Package className="text-yellow-600" size={20} />;
      case 'Clock':
          return <Clock className="text-brown-600" size={20}/>;
      case 'Truck':
          return <Truck className="text-red-600" size={20}/>;
      case 'Scale':
          return <Scale className="text-yellow-600" size={20}/>;    
      case 'ThumbsUp':
            return <ThumbsUp className="text-green-600" size={20}/>;    
      case 'ThumbsDown':
          return <ThumbsDown className="text-red-600" size={20}/>;    
      case 'ShoppingBag':
            return <ShoppingBag className="text-green-400" size={20}/>;
      case 'FileBarChart':
            return <FileBarChart className="text-red-600" size={20}/>; 
      case 'Tag':
            return <Tag className="text-brown-600" size={20}/>; 
      case 'AlertCircle':
            return <AlertCircle color="#ff6b6b" size={20}/>; 
      case 'MailWarning':
            return <MailWarning color="#339af0" size={20}/>; 
      case 'RefreshCcw':
            return <RefreshCcw color="#51cf66" size={20}/>; 
      case 'Store':
            return <Store color="#845ef7" size={20}/>; 
      default:
        return <Store className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-sm text-gray-600 mt-1">
                You have {unreadCount} unread notifications
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Mark all as read
            </button>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                filter === 'unread'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                filter === 'read'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {getFilteredNotifications().map((notification) => (
            <div
              key={notification.notificationID}
              className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                notification.status === 'unread' ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{notification.text}</p>
                  <div className="mt-1 flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </span>
                    {notification.status === 'unread' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(notification.notificationID)}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.notificationID)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredNotifications().length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
};