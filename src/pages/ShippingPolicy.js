import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, Globe, MapPin, Shield, AlertCircle, Calendar } from 'lucide-react';

const ShippingPolicy = () => {
  const deliveryZones = [
    {
      zone: "Urban Areas",
      machinery: "2-5 business days",
      produce: "Same day - Next day",
      cost: "Free for orders above $500"
    },
    {
      zone: "Suburban Areas",
      machinery: "3-7 business days",
      produce: "1-2 business days",
      cost: "Free for orders above $750"
    },
    {
      zone: "Rural Areas",
      machinery: "5-10 business days", 
      produce: "2-3 business days",
      cost: "Free for orders above $1000"
    }
  ];

  const shippingMethods = [
    {
      name: "Standard Shipping",
      description: "Regular ground shipping for most items",
      time: "5-7 business days",
      icon: Truck
    },
    {
      name: "Express Delivery",
      description: "Expedited shipping for urgent orders",
      time: "2-3 business days",
      icon: Package
    },
    {
      name: "Fresh Produce Express",
      description: "Temperature-controlled delivery for fresh items",
      time: "Same day - Next day",
      icon: Clock
    }
  ];

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
              Shipping & Delivery Policy
            </motion.h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-green-100">
              Fast, reliable, and secure delivery services by WASP Warden
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Delivery Promise */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-green-50 rounded-lg p-8 mb-12"
        >
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-green-600" />
            <h2 className="ml-3 text-2xl font-bold text-gray-900">Our Delivery Promise</h2>
          </div>
          <p className="text-gray-600 text-lg">
            We understand the importance of timely delivery in agriculture. Whether it's machinery for your operations or fresh produce for your business, 
            we ensure careful handling and timely delivery of your orders. All our deliveries are tracked and insured.
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-green-100"
              >
                <method.icon className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <div className="flex items-center text-green-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{method.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Zones Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Delivery Zones & Times</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machinery Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fresh Produce</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryZones.map((zone) => (
                  <tr key={zone.zone} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.zone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.machinery}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.produce}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
              Important Notes
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Delivery times may vary during peak seasons</li>
              <li>• All machinery deliveries require signature</li>
              <li>• Fresh produce delivered in temperature-controlled vehicles</li>
              <li>• Track your order real-time through your dashboard</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Delivery Schedule
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Monday to Saturday: 8:00 AM - 8:00 PM</li>
              <li>• Sunday: Fresh produce only (8:00 AM - 2:00 PM)</li>
              <li>• Machinery delivery requires prior appointment</li>
              <li>• Special delivery times can be arranged</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;