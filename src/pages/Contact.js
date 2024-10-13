import React from 'react';
import Image1 from '../assets/images/support.jpg';

const ContactForm = () => {
  return (
    <div className="flex bg-gray-100 p-8 max-w-6xl mx-auto my-10 rounded-lg shadow-lg">
      {/* Left column */}
      <div className="w-1/2 pr-8">
        <div className="mb-8">
          <img src={Image1} alt="Customer support illustration" className="w-full" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Address</h3>
          <p className="text-gray-600 mb-4">Defence Raya, Lahore, Pakistan</p>
          
          <h3 className="font-semibold text-lg mb-2">Phone</h3>
          <p className="text-gray-600 mb-4">+9290122122</p>
          
          <h3 className="font-semibold text-lg mb-2">Email Address</h3>
          <p className="text-gray-600">waspwarden@support.com</p>
        </div>
      </div>
      
      {/* Right column - Form */}
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6">How can we improve your experience?</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input type="text" id="name" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input type="email" id="email" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
            <input type="text" id="subject" className="w-full p-2 border rounded" />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
            <textarea id="description" rows="5" className="w-full p-2 border rounded"></textarea>
          </div>
          
          <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;