import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf, Cpu, Store, Recycle } from 'lucide-react';
import Navbar from './Navbar';

const HomePage = () => {
  const carouselImages = [
    '/assets/images/f1.jpg',
    '/assets/images/f2.jpg',
    '/assets/images/f3.jpg',
  ];

  const features = [
    { title: 'IoT Integration', description: 'Smart farming with real-time data', icon: Leaf },
    { title: 'AI-Powered Insights', description: 'Predictive analytics for better yields', icon: Cpu },
    { title: 'Direct Market Access', description: 'Connect farmers to consumers seamlessly', icon: Store },
    { title: 'Sustainable Practices', description: 'Eco-friendly farming solutions', icon: Recycle },
  ];

  const testimonials = [
    { name: 'John Doe', role: 'Farmer', text: 'This platform revolutionized how I manage my farm and sell produce.', avatar: '/images/farmer-avatar.jpg' },
    { name: 'Jane Smith', role: 'Consumer', text: 'I love having access to fresh, local produce at my fingertips.', avatar: '/images/consumer-avatar.jpg' },
    { name: 'Mike Johnson', role: 'Agribusiness Owner', text: 'The analytics tools have greatly improved our supply chain efficiency.', avatar: '/images/business-avatar.jpg' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
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
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-4">
                  <motion.h1 
                    className="text-5xl font-bold mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Cultivating Connections in Agriculture
                  </motion.h1>
                  <motion.p 
                    className="text-xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Empowering farmers, consumers, and agribusinesses with innovative technology
                  </motion.p>
                  <motion.a
                    href="#features"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full text-lg transition duration-300 inline-flex items-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Explore Our Solutions
                    <ChevronRight className="ml-2" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Innovative Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-yellow-500 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-8 rounded-xl shadow-lg h-full flex flex-col"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="mb-6 text-lg italic flex-grow text-gray-600">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{testimonial.name}</p>
                      <p className="text-yellow-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-yellow-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Ready to Transform Your Agricultural Journey?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-600">Join our platform today and experience the future of farming, consumer connections, and agribusiness management.</p>
            <motion.a
              href="/signup"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ChevronRight className="ml-2" />
            </motion.a>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Farm E-commerce Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;