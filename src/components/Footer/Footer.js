import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

import Image from '../../assets/images/warden.png'

export default () => {
  const footerNavs = [

    {
      label: 'Resources',
      items: [
   
        { name: 'Refund & Returns Policy', href: '/return-policy' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-conditions' }
      ],
    },
    {
      label: 'Customer Care',
      items: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'About Us', href: '/about-us' }
    
      ],
    },
    {
      label: 'Legal & Policy',
      items: [
        { name: 'Shipping & Delivery Policy', href: '/shipping-delivery-policy' },
       
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Disclaimer', href: '/disclaimer' },
        { name: 'Intellectual Property', href: '/intellectual-property-policy' }
      ],
    },
  ];

  return (
    <footer className="bg-white text-green-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src={Image} alt="Wasp Warden Logo" className="w-16 h-16 mr-3" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">Wasp Warden</h3>
              </div>
            </Link>
            <p className="text-sm mb-6 leading-relaxed">
              Protecting your crops naturally since 2010. Our eco-friendly solutions keep your farm healthy and productive,
              ensuring a sustainable future for agriculture.
            </p>
           
          </div>
          
          {footerNavs.map((nav) => (
            <div key={nav.label} className="col-span-1">
              <h4 className="text-lg font-medium mb-4 text-green-700">{nav.label}</h4>
              <ul className="space-y-2">
                {nav.items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm hover:text-green-600 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-green-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-green-700 hover:text-green-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-green-700 hover:text-green-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-green-700 hover:text-green-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Wasp Warden. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};