import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../assets/images/ward.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { title: "Home", path: "/home" },
    { title: "Mart", path: "/mart" },
    { title: "Marketplace", path: "/marketplace" },
    { title: "Cart", path: "/cart" },
    // { title: "Inbox", path: "/inbox" },
    // { title: "My Warden", path: "/my-warden" },
    // { title: "IoT Dashboard", path: "/iot-dashboard" },
    { title: "My Profile", path: "/profile" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-green-600 w-full shadow-md">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-4 md:block">
          <Link to="/" className="flex items-center">
            <img src={Image} alt="Logo" className="h-10 md:h-12" />
            <span className="ml-2 text-xl font-bold text-white">Wasp Warden</span>
          </Link>
          <div className="md:hidden">
            <button
              className="text-white hover:text-green-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, idx) => (
              <li key={idx} className="text-white hover:text-green-200">
                <Link to={item.path} className="block">
                  {item.title}
                </Link>
              </li>
            ))}
            <div className='space-y-3 items-center gap-x-6 md:flex md:space-y-0'>
              <li>
                <Link to="/login" className="block py-2 px-4 text-center text-white bg-green-700 hover:bg-green-800 rounded-md shadow transition duration-300">
                  Login
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;