import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Lock } from 'lucide-react';

import Image from '../assets/images/wasp.png';

const SignUpPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    cnic: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Implement sign-up logic here
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="m-auto bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <img src={Image} alt="Logo" className="mx-auto mb-4" style={{ width: '80px', height: 'auto' }} />
            <h2 className="text-2xl font-bold text-green-800">Create an Account</h2>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex justify-between mb-4">
              {['farmer', 'agri-business', 'consumer'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={userType === type}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>

            <InputField
              icon={<User className="h-5 w-5 text-gray-400" />}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputField
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            {userType === 'agri-business' && (
              <InputField
                icon={<Phone className="h-5 w-5 text-gray-400" />}
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            )}

            {userType === 'consumer' && (
              <InputField
                icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                type="text"
                name="cnic"
                placeholder="CNIC"
                value={formData.cnic}
                onChange={handleChange}
              />
            )}

            <InputField
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <InputField
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Account
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon, type, name, placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default SignUpPage;