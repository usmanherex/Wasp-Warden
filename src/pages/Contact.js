import React, { useState } from 'react';
import Image1 from '../assets/images/support.jpg';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          content: `Subject: ${formData.subject}\n\n${formData.description}`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Message sent successfully!', type: 'success' });
        setFormData({ name: '', email: '', subject: '', description: '' });
      } else {
        setMessage({ text: data.message || 'Failed to send message', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-4 md:p-8 max-w-6xl mx-auto my-10 rounded-lg shadow-lg">
      {/* Left column */}
      <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
        <div className="mb-8">
          <img src={Image1} alt="Customer support illustration" className="w-full rounded-lg" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Address</h3>
          <p className="text-gray-600 mb-4">Defence Raya, Lahore, Pakistan</p>
          
          <h3 className="font-semibold text-lg mb-2">Phone</h3>
          <p className="text-gray-600 mb-4">+92323122122</p>
          
          <h3 className="font-semibold text-lg mb-2">Email Address</h3>
          <p className="text-gray-600">waspwarden@support.com</p>
        </div>
      </div>
      
      {/* Right column - Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-6">How can we improve your experience?</h2>
        {message.text && (
          <div className={`p-4 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
            <input 
              type="text" 
              id="subject" 
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
            <textarea 
              id="description" 
              rows="5" 
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;