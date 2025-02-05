import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  Eye, 
  BarChart, 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  XCircle,
  X 
} from 'lucide-react';

const CookiePolicy = () => {
  const [selectedTab, setSelectedTab] = useState('essential');
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [showDialog, setShowDialog] = useState(false);


 // Cookie types remain the same...
 const cookieTypes = [
  {
    id: 'essential',
    title: 'Essential Cookies',
    description: 'Required for basic site functionality. Cannot be disabled.',
    icon: Shield,
    required: true
  },
  {
    id: 'analytics',
    title: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    icon: BarChart,
    required: false
  },
  {
    id: 'marketing',
    title: 'Marketing Cookies',
    description: 'Used to deliver personalized advertisements.',
    icon: MessageSquare,
    required: false
  },
  {
    id: 'functional',
    title: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization.',
    icon: Settings,
    required: false
  }
];

const handleToggle = (cookieType) => {
  if (cookieType === 'essential') return;
  setPreferences(prev => ({
    ...prev,
    [cookieType]: !prev[cookieType]
  }));
};

const savePreferences = () => {
  // Save preferences as a cookie
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Cookie expires in 1 year

  document.cookie = `cookiePreferences=${JSON.stringify(preferences)}; expires=${expiryDate.toUTCString()}; path=/`;
  setShowDialog(true);
};

// Dialog Component
const Dialog = () => (
  <AnimatePresence>
    {showDialog && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-md w-full relative"
        >
          <button 
            onClick={() => setShowDialog(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Preferences Saved Successfully!
            </h3>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              <p>Your cookie preferences have been saved and will be remembered for future visits.</p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Preferences:</h4>
                <ul className="text-left text-sm space-y-1">
                  {Object.entries(preferences).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key}</span>
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDialog(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Got it!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
 

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Cookie Icon */}
      <motion.div
        className="fixed bottom-4 right-4 text-green-600"
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Cookie className="h-12 w-12" />
      </motion.div>

      {/* Header */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Cookie Policy
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-green-100">
              WASP Warden's commitment to transparency and user privacy
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Cookie Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 rounded-lg p-8 mb-12"
        >
          <div className="flex items-center mb-6">
            <Eye className="h-8 w-8 text-green-600" />
            <h2 className="ml-3 text-2xl font-bold text-gray-900">Cookie Overview</h2>
          </div>
          <p className="text-gray-600 text-lg">
            We use cookies to enhance your experience on our platform. These cookies help us understand 
            how you interact with our agricultural marketplace, machinery listings, and IoT dashboards, 
            allowing us to continuously improve our services.
          </p>
        </motion.div>

        {/* Cookie Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cookie Types */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {cookieTypes.map((cookie) => (
                <motion.div
                  key={cookie.id}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white p-6 rounded-lg shadow-sm border ${
                    selectedTab === cookie.id ? 'border-green-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTab(cookie.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <cookie.icon className="h-6 w-6 text-green-600" />
                      <h3 className="ml-3 text-lg font-semibold text-gray-900">{cookie.title}</h3>
                    </div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                    >
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={cookie.required || preferences[cookie.id]}
                          onChange={() => handleToggle(cookie.id)}
                          disabled={cookie.required}
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                          ${(preferences[cookie.id] || cookie.required) ? 'bg-green-600' : 'bg-gray-200'}
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 
                          after:w-5 after:transition-all peer-checked:after:translate-x-full`}>
                        </div>
                      </label>
                    </motion.div>
                  </div>
                  <p className="mt-2 text-gray-600">{cookie.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Summary Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-green-50 p-6 rounded-lg h-fit sticky top-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Choices</h3>
            <div className="space-y-4 mb-6">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{key}</span>
                  {value ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={savePreferences}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Save Preferences
            </motion.button>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Use Cookies</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• To remember your preferences and settings</li>
              <li>• To improve site performance and speed</li>
              <li>• To analyze how our site is used</li>
              <li>• To personalize your farming experience</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rights</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Modify your preferences at any time</li>
              <li>• Clear cookies from your browser</li>
              <li>• Request information about stored data</li>
              <li>• Opt-out of non-essential cookies</li>
            </ul>
          </div>
        </motion.div>
      </div>
      
      <Dialog />
    </div>
  );
};

export default CookiePolicy;