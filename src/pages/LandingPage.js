import React from 'react';
import { Link } from 'react-router-dom';

import Image1 from '../assets/images/f1.jpg';
import Image2 from '../assets/images/f2.jpg';
import Image3 from '../assets/images/f3.jpg';

const LandingPage = () => {
  const carouselImages = [
    Image1,
    Image2,
    Image3,
  ];

  return (
    <div>
      <div className="bg-[#171313] text-white">
        <div className="container mx-auto py-20 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Welcome to Wasp Warden</h1>
              <p className="text-lg mb-8">
                Connecting Farmers, Agri-Businesses, and Consumers for a Sustainable Future
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/signup"
                  className="bg-[#FF9933] text-[#171313] px-6 py-3 rounded-md hover:bg-[#FF7F00]"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border border-[#FF9933] text-[#FF9933] px-6 py-3 rounded-md hover:bg-[#FF9933] hover:text-[#171313]"
                >
                  Login
                </Link>
              </div>
            </div>
            <div>
              {/* Add your carousel implementation here */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-20 px-6">
        {/* Add your middle section content here */}
      </div>
    </div>
  );
};

export default LandingPage;