import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Sprout, Store, Activity, Bot } from 'lucide-react';

const Disclaimer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4 flex items-center justify-center gap-3">
            <ShieldCheck className="h-10 w-10" />
            WASP WARDEN Disclaimer
          </h1>
          <p className="text-green-600 text-lg">
            Please read this disclaimer carefully before using our services
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Marketplace Disclaimer */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Store className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">Marketplace Disclaimer</h2>
                <p className="text-gray-600">
                  WASP WARDEN acts solely as a platform connecting buyers and sellers. We do not guarantee the quality, safety, or availability of agricultural machinery, vegetables, or fruits listed on our marketplace. Users are advised to exercise due diligence before making purchases.
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Models Disclaimer */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Bot className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">AI Disease Detection Disclaimer</h2>
                <p className="text-gray-600">
                  Our AI models for disease detection are tools for assistance only and should not be considered as definitive diagnostic solutions. Results should be verified by qualified agricultural experts. We accept no responsibility for crop losses or damages resulting from AI predictions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* IoT Dashboard Disclaimer */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <Activity className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">IoT Monitoring Disclaimer</h2>
                <p className="text-gray-600">
                  The IoT dashboard monitoring system may experience occasional downtime, delays, or inaccuracies. Users should not rely solely on our IoT systems for critical farming decisions. We do not guarantee continuous availability or accuracy of sensor data.
                </p>
              </div>
            </div>
          </motion.div>

          {/* General Limitations */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">Limitation of Liability</h2>
                <p className="text-gray-600">
                  WASP WARDEN, its employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages resulting from the use of our services, including but not limited to financial losses, crop damages, or business interruptions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-8 p-4 bg-green-50 rounded-lg"
          >
            <Sprout className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 text-sm">
              By using WASP WARDEN's services, you acknowledge and agree to all the terms outlined in this disclaimer. We reserve the right to modify these terms at any time without prior notice.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Disclaimer;