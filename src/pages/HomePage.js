import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf, Cpu, Store, Recycle, Users, TrendingUp, Award, BarChart } from 'lucide-react';

import Image1 from '../assets/images/f1.jpg';
import Image2 from '../assets/images/f2.jpg';
import Image3 from '../assets/images/f3.jpg';
import Image4 from '../assets/images/7.png';
import Image5 from '../assets/images/5.jpg';
import Image6 from '../assets/images/6.jpg';

const HomePage = () => {
  const carouselImages = [
    Image1,
    Image2,
  ];

  const features = [
    { title: 'IoT Integration', description: 'Leverage smart sensors and real-time data for precise farming', icon: Leaf },
    { title: 'AI-Powered Insights', description: 'Harness machine learning for crop prediction and optimization', icon: Cpu },
    { title: 'Direct Market Access', description: 'Connect farmers to consumers with our innovative marketplace', icon: Store },
    { title: 'Sustainable Practices', description: 'Promote eco-friendly farming with advanced resource management', icon: Recycle },
  ];

  const testimonials = [
    { name: 'Umer Zia', role: 'Organic Farmer', text: 'This platform has revolutionized how I manage my farm and connect with customers. My yield has increased by 30% in just one season!', avatar: Image4 },
    { name: 'Ali Hassan', role: 'Urban Consumer', text: 'I love having access to fresh, local produce at my fingertips. The transparency in the supply chain gives me confidence in what Im buying.', avatar: Image5 },
    { name: 'Bilal Khan', role: 'Agribusiness CEO', text: 'The analytics tools have greatly improved our supply chain efficiency. Weve reduced waste by 25% and increased farmer satisfaction.', avatar: Image6 },
  ];

  const stats = [
    { title: 'Farmers Onboarded', value: '10,000+', icon: Users },
    { title: 'Yield Increase', value: '35%', icon: TrendingUp },
    { title: 'Sustainability Score', value: '92/100', icon: Award },
    { title: 'Market Reach', value: '5M+', icon: BarChart },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <main className="flex-grow">
        {/* Hero Section with Carousel */}
        <div className="relative h-[80vh]">
          {carouselImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={img} alt={`Farm ${index + 1}`} className="object-cover h-full w-full" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <motion.h1 
                    className="text-5xl sm:text-6xl font-bold mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Cultivating the Future of Agriculture
                  </motion.h1>
                  <motion.p 
                    className="text-xl sm:text-2xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Empowering farmers with cutting-edge technology for sustainable and profitable farming
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link to="/my-warden" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center">
                      Explore Our Solutions
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vision Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">Our Vision</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <img src={Image3} alt="Sustainable Agriculture" className="rounded-lg shadow-xl" />
              </div>
              <div className="md:w-1/2 md:pl-10">
                <h3 className="text-3xl font-semibold mb-6 text-green-700">Growing a Sustainable Future</h3>
                <p className="text-xl text-gray-600 mb-6">We envision a world where technology bridges the gap between farm and table, fostering sustainability, efficiency, and prosperity across the entire agricultural ecosystem.</p>
                <ul className="space-y-4">
                  <li className="flex items-center text-lg text-gray-700">
                    <ChevronRight className="mr-2 text-green-500" />
                    Empower farmers with data-driven insights
                  </li>
                  <li className="flex items-center text-lg text-gray-700">
                    <ChevronRight className="mr-2 text-green-500" />
                    Enhance food security through smart resource management
                  </li>
                  <li className="flex items-center text-lg text-gray-700">
                    <ChevronRight className="mr-2 text-green-500" />
                    Create transparent and efficient supply chains
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-green-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">Our Innovative Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-green-500 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <stat.icon className="w-16 h-16 mx-auto mb-4 text-green-300" />
                  <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-xl">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-green-800">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-green-50 p-8 rounded-xl shadow-lg h-full flex flex-col"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="mb-6 text-lg italic flex-grow text-gray-600">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-lg text-green-700">{testimonial.name}</p>
                      <p className="text-green-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Farm?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">Join our platform today and experience the future of farming with cutting-edge technology and data-driven insights.</p>
            <Link to="/signup" className="bg-white text-green-800 hover:bg-green-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center">
              Get Started Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;