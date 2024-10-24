import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Lock, Building, MapPin, Upload, ArrowLeft } from 'lucide-react';
import logo from '../assets/images/wasp.png';

const SignUpPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cnic: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessDescription: '',
    profilePicture: null,
    address: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-8 px-4">
      {/* Back to Home Link */}
      <Link 
        to="/home" 
        className="absolute top-4 left-4 flex items-center text-white hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="ml-2 text-sm font-medium">Back to Home</span>
      </Link>
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6">
          <div className="text-center mb-6">
            <img 
              src={logo} 
              alt="Logo" 
              className="mx-auto mb-3 h-22 w-24"
            />
            <h2 className="text-2xl font-bold text-green-800">Create an Account</h2>
            <p className="text-gray-600 text-sm mt-1">Choose your account type to get started</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex justify-center space-x-4 mb-6">
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
                  <span className="text-sm font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Personal Information</p>
                <InputField
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />

                <InputField
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
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

                <InputField
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

                <InputField
                  icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                  type="text"
                  name="cnic"
                  placeholder="CNIC Number"
                  value={formData.cnic}
                  onChange={handleChange}
                />
              </div>

              {userType === 'agri-business' && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Business Information</p>
                  <InputField
                    icon={<Building className="h-5 w-5 text-gray-400" />}
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  <div>
                    <textarea
                      name="businessDescription"
                      placeholder="Business Description"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {(userType === 'farmer' || userType === 'agri-business') && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <InputField
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Security</p>
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
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                <div className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
              </div>
            </div>
          
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Account
              </button>
              <p className="text-sm text-gray-600 text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Log in
                </Link>
              </p>
            </div>
          </form>
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