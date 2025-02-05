import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Brain, ShoppingBag, Cpu, Users, Globe } from 'lucide-react';

// Custom hook for animated counter
const useAnimatedCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [end, duration]);
  
  return count;
};

// Animated stat component
const AnimatedStat = ({ value, label }) => {
  const animatedValue = useAnimatedCounter(parseInt(value.replace(/\D/g, '')));
  const suffix = value.includes('+') ? '+' : '%';
  
  return (
    <div>
      <div className="text-4xl font-bold text-green-600 mb-2">
        {animatedValue}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const AboutUs = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-green-600" />,
      title: "IoT Solutions",
      description: "Advanced sensor networks to monitor soil health, moisture levels, and crop conditions in real-time."
    },
    {
      icon: <Brain className="w-8 h-8 text-green-600" />,
      title: "AI-Powered Disease Detection",
      description: "State-of-the-art machine learning models for early detection and prevention of crop diseases."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
      title: "Digital Marketplace",
      description: "Direct farm-to-market platform connecting farmers with buyers for better price realization."
    }
  ];

  const stats = [
    { value: "10000+", label: "Farmers Empowered" },
    { value: "95%", label: "Disease Detection Accuracy" },
    { value: "50+", label: "Countries Served" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Agriculture with Technology
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional farming wisdom to create 
              sustainable and profitable solutions for modern agriculture.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To empower farmers with innovative technology solutions that increase yield, 
              reduce waste, and promote sustainable farming practices while ensuring 
              fair market access and profitability.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Global Impact Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Our Global Impact</h2>
              <p className="text-green-100 mb-6">
                We're committed to transforming agriculture worldwide through sustainable 
                technology solutions that benefit both farmers and the environment.
              </p>
              <button className="bg-white text-green-900 px-6 py-2 rounded-full font-semibold flex items-center hover:bg-green-50 transition-colors">
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Globe className="w-48 h-48 text-green-100 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Our diverse team combines expertise in agriculture, technology, and data science 
            to deliver innovative solutions that make a real difference in farming communities.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Join Our Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;