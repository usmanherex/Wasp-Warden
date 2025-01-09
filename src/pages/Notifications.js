import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    // Simulated notifications data
    const mockNotifications = [
      {
        id: 1,
        text: "New order #123 has been placed in your mart. Check it out!",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        type: 'order'
      },
      {
        id: 2,
        text: "Your IoT device 'Garden Sensor' detected unusual activity.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        type: 'alert'
      },
      {
        id: 3,
        text: "Welcome bonus: 20% off on your next purchase in the marketplace!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        type: 'promotion'
      },
      {
        id: 4,
        text: "Your monthly Warden report is ready. View your statistics now.",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
        type: 'report'
      },
      {
        id: 5,
        text: "New message from Support regarding your recent inquiry.",
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        read: true,
        type: 'message'
      },
      {
        id: 6,
        text: "System maintenance scheduled for tomorrow at 2 AM EST.",
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        read: true,
        type: 'system'
      },
      {
        id: 7,
        text: "Your password was changed successfully.",
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
        read: true,
        type: 'security'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)} hours ago`;
    return `${Math.floor(minutes/1440)} days ago`;
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'order':
        return <Bell className="text-blue-500" size={20} />;
      case 'promotion':
        return <Bell className="text-yellow-500" size={20} />;
      case 'report':
        return <Clock className="text-purple-500" size={20} />;
      case 'message':
        return <Bell className="text-green-500" size={20} />;
      case 'system':
        return <AlertCircle className="text-orange-500" size={20} />;
      case 'security':
        return <CheckCircle className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
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
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                !notification.read ? 'bg-green-50' : ''
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
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => {
                        setNotifications(
                          notifications.map(n =>
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        );
                      }}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      Mark as read
                    </button>
                  )}
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

export default NotificationsPage;