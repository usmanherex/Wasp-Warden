import React from 'react';
import { motion } from 'framer-motion';
import { Copyright, FileText, Shield, Book, AlertCircle, Lock, FileKey, ScrollText } from 'lucide-react';

const IntellectualPropertyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileKey className="h-12 w-12 text-green-700" />
            <h1 className="text-4xl font-bold text-green-800">
              Intellectual Property Policy
            </h1>
          </div>
          <p className="text-green-600 text-lg">
            WASP WARDEN's Guidelines for Content Protection and Usage
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Copyright Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Copyright className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-3">Copyright Protection</h2>
                <div className="space-y-3 text-gray-600">
                  <p>All content on the WASP WARDEN platform, including but not limited to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>AI disease detection algorithms and models</li>
                    <li>IoT dashboard interfaces and data visualizations</li>
                    <li>Marketplace listings and product descriptions</li>
                    <li>Technical documentation and user guides</li>
                    <li>Website design and graphics</li>
                  </ul>
                  <p>is protected by copyright laws and is the exclusive property of WASP WARDEN unless otherwise stated.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trademark Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-3">Trademark Rights</h2>
                <p className="text-gray-600">
                  The WASP WARDEN name, logo, and any other product or service names are registered trademarks of our company. Any unauthorized use of these trademarks is strictly prohibited. Vendors and partners must obtain written permission before using our trademarks in any marketing materials or promotional content.
                </p>
              </div>
            </div>
          </motion.div>

          {/* User Content Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-3">User-Generated Content</h2>
                <p className="text-gray-600">
                  By uploading content to our platform (including product listings, reviews, and images), users grant WASP WARDEN a non-exclusive, worldwide, royalty-free license to use, modify, and display the content for platform-related purposes. Users retain ownership of their original content and are responsible for ensuring they have the right to share it.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Data Rights Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Lock className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-3">IoT and AI Data Rights</h2>
                <p className="text-gray-600">
                  Data collected through our IoT devices and AI models remains the property of the respective farmers/users. WASP WARDEN maintains the right to use anonymized aggregate data for improving our services and research purposes. Individual user data will never be sold or shared without explicit consent.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enforcement Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-3">Policy Enforcement</h2>
                <p className="text-gray-600">
                  WASP WARDEN actively monitors for intellectual property violations and will take appropriate action, including content removal and account suspension, for any unauthorized use of our intellectual property. Users can report violations through our dedicated IP complaint form.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8 p-6 bg-green-50 rounded-xl"
          >
            <ScrollText className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 text-sm">
              This intellectual property policy is subject to updates. Users will be notified of any significant changes. For specific licensing requests or IP-related inquiries, please contact our legal department.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntellectualPropertyPolicy;