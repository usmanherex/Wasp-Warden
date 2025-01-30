import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Cpu, Store, Recycle, Users, TrendingUp, Award, BarChart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Image1 from '../assets/images/f1.jpg';
import Image2 from '../assets/images/f2.jpg';
import Image3 from '../assets/images/f3.jpg';
import Image4 from '../assets/images/7.png';
import Image5 from '../assets/images/5.jpg';
import Image6 from '../assets/images/6.jpg';
const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });
  
  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [end, duration, inView]);

  return <span ref={ref}>{typeof end === 'string' && end.includes('+') ? 
    `${count.toLocaleString()}+` : 
    count.toLocaleString()}</span>;
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    { title: 'Farmers Onboarded', value: '10000', suffix: '+', icon: Users },
    { title: 'Yield Increase', value: '35', suffix: '%', icon: TrendingUp },
    { title: 'Sustainability Score', value: '92', suffix: '/100', icon: Award },
    { title: 'Market Reach', value: '5000000', suffix: '+', icon: BarChart },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <div ref={heroRef} className="relative h-[90vh] overflow-hidden">
          <div className={`absolute inset-0 transition-transform duration-1000 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {carouselImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={img} alt={`Farm ${index + 1}`} className="object-cover h-full w-full" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fadeIn">
                      Cultivating the Future
                    </h1>
                    <p className="text-2xl md:text-3xl mb-8 animate-slideUp">
                      Empowering farmers with cutting-edge technology
                    </p>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center">
                      Explore Our Solutions
                      <ChevronRight className="ml-2 h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section ref={featuresRef} className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-20 text-green-800">
              Our Innovative Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                    featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <feature.icon className="w-16 h-16 text-green-500 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-green-700">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-green-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-20">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center transform transition-all duration-500 hover:scale-105"
                >
                  <stat.icon className="w-20 h-20 mx-auto mb-6 text-green-300" />
                  <h3 className="text-5xl font-bold mb-4">
                    <CountUp end={parseInt(stat.value)} />
                    {stat.suffix}
                  </h3>
                  <p className="text-2xl text-green-100">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-700 opacity-50"></div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-20 text-green-800">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2"
                >
                  <div className="mb-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
                  </div>
                  <p className="text-xl italic mb-6 text-gray-600">"{testimonial.text}"</p>
                  <div className="text-center">
                    <p className="font-semibold text-xl text-green-700">{testimonial.name}</p>
                    <p className="text-green-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-8">Ready to Transform Your Farm?</h2>
            <p className="text-2xl mb-12 max-w-3xl mx-auto">
              Join our platform today and experience the future of farming
            </p>
            <button className="bg-white text-green-700 hover:bg-green-50 font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center">
              Get Started Now
              <ChevronRight className="ml-2 h-6 w-6" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;