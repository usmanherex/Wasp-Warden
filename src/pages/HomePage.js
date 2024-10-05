import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const carouselImages = [
    '/images/farm1.jpg',
    '/images/farm2.jpg',
    '/images/farm3.jpeg',
  ];

  const features = [
    { title: 'IoT Integration', description: 'Smart farming with real-time data', icon: '🌱' },
    { title: 'AI-Powered Insights', description: 'Predictive analytics for better yields', icon: '🤖' },
    { title: 'Direct Market Access', description: 'Connect farmers to consumers seamlessly', icon: '🏪' },
  ];

  const testimonials = [
    { name: 'John Doe', role: 'Farmer', text: 'This platform revolutionized how I manage my farm and sell produce.' },
    { name: 'Jane Smith', role: 'Consumer', text: 'I love having access to fresh, local produce at my fingertips.' },
    { name: 'Mike Johnson', role: 'Agribusiness Owner', text: 'The analytics tools have greatly improved our supply chain efficiency.' },
  ];

  const stats = [
    { value: '10,000+', label: 'Farmers Connected' },
    { value: '500,000+', label: 'Happy Consumers' },
    { value: '1,000+', label: 'Agribusinesses Empowered' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Simple Carousel */}
        <div className="relative h-[70vh]">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt={`Farm ${index + 1}`} className="object-cover h-full w-full" />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-bold mb-4">Cultivating Connections</h1>
                  <p className="text-xl">Bridging Farmers, Consumers, and Agribusinesses</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Innovative Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-[#171313] text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-6 rounded-lg bg-[#2a2a2a] transition-all duration-300 hover:bg-[#3a3a3a]">
                  <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-xl">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                  <p className="mb-4 italic flex-grow">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;