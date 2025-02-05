import React from 'react';
import { ArrowLeft, Leaf, RefreshCw, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ReturnPolicy = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };
    
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
            >
              Return Policy
            </motion.h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-green-100">
              WASP Warden's commitment to customer satisfaction and fair returns
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Machinery Returns */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 rounded-lg p-8 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <RefreshCw className="h-8 w-8 text-green-600" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Machinery Returns</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li>• 30-day return window for unused machinery</li>
              <li>• Must include original packaging and documentation</li>
              <li>• Free return shipping for defective items</li>
              <li>• Inspection required before refund processing</li>
            </ul>
          </motion.div>

          {/* Fresh Produce Returns */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 rounded-lg p-8 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Fresh Produce Returns</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li>• 24-hour return window for fresh produce</li>
              <li>• Photo evidence required for quality issues</li>
              <li>• Instant refund for verified quality concerns</li>
              <li>• Same-day replacement options available</li>
            </ul>
          </motion.div>

          {/* Digital Services */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 rounded-lg p-8 shadow-sm"
          >
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-green-600" />
              <h2 className="ml-3 text-xl font-semibold text-gray-900">Digital Services</h2>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li>• 7-day trial period for AI models</li>
              <li>• Full refund if accuracy below 90%</li>
              <li>• IoT dashboard subscription cancellation</li>
              <li>• Pro-rated refunds for unused period</li>
            </ul>
          </motion.div>
        </div>

        {/* Process Timeline */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Request Return",
                description: "Submit return request through your account dashboard"
              },
              {
                step: 2,
                title: "Approval",
                description: "Receive return authorization within 24 hours"
              },
              {
                step: 3,
                title: "Return Item",
                description: "Ship item back or schedule pickup as applicable"
              },
              {
                step: 4,
                title: "Refund",
                description: "Receive refund within 5-7 business days"
              }
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.step * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-green-100"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-green-50 rounded-lg p-8">
          <div className="flex items-center justify-between"  onClick={handleContactClick}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
              <p className="mt-2 text-gray-600">Our customer service team is available 24/7</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center"
            >

              <HelpCircle className="h-5 w-5 mr-2" />
              Contact Support
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;