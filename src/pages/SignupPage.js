import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Lock, Building, MapPin, Upload, ArrowLeft , Calendar} from 'lucide-react';
import logo from '../assets/images/wasp.png';
import axios from 'axios';

const SignUpPage = () => {
  const [userType, setUserType] = useState('consumer');
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    nationalID: '',
    address: '',
    gender: '',
    profilePicture: null,
    dateOfBirth: '',
    
    // Conditional fields based on user type
    consumerType: '',
    associatedCompany: '',
    
    agriBusiness: {
      businessName: '',
      businessAddress:'',
      businessDescription: '',
      businessType: '',
      businessRegistrationNumber: ''
    },
    
    farmer: {
      farmAddress: '',
      farmSize: '',
      specialization: '',
      farmYieldCapacity: ''
    }
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects for specific user types
    if (name.startsWith('agriBusiness.') || name.startsWith('farmer.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, profilePicture: e.target.files[0] }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Create FormData for file upload
    const formPayload = new FormData();
    
    // Append all form fields
    formPayload.append('userName', formData.userName);
    formPayload.append('firstName', formData.firstName);
    formPayload.append('lastName', formData.lastName);
    formPayload.append('email', formData.email);
    formPayload.append('password', formData.password);
    formPayload.append('phoneNumber', formData.phoneNumber);
    formPayload.append('nationalID', formData.nationalID);
    formPayload.append('address', formData.address);
    formPayload.append('gender', formData.gender);
    formPayload.append('dateOfBirth', formData.dateOfBirth);
    formPayload.append('userType', userType.charAt(0).toUpperCase() + userType.slice(1));
    
    // Append profile picture if exists
    if (formData.profilePicture) {
      formPayload.append('profilePicture', formData.profilePicture);
    }

    // Add type-specific details
    switch (userType) {
      case 'consumer':
        formPayload.append('consumerType', formData.consumerType);
        if (formData.consumerType === 'Corporate') {
          formPayload.append('associatedCompany', formData.associatedCompany);
        }
        break;
      case 'agri-business':
        formPayload.append('businessName', formData.agriBusiness.businessName);
        formPayload.append('businessAddress', formData.agriBusiness.businessAddress);
        formPayload.append('businessDescription', formData.agriBusiness.businessDescription);
        formPayload.append('businessType', formData.agriBusiness.businessType);
        formPayload.append('businessRegistrationNumber', formData.agriBusiness.businessRegistrationNumber);
        break;
      case 'farmer':
        formPayload.append('farmAddress', formData.farmer.farmAddress);
        formPayload.append('farmSize', formData.farmer.farmSize);
        formPayload.append('specialization', formData.farmer.specialization);
        formPayload.append('farmYieldCapacity', formData.farmer.farmYieldCapacity);
        break;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Handle successful registration
      alert('Registration Successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 py-8 px-4">
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
              {['consumer', 'farmer', 'agri-business'].map((type) => (
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
              {/* Common Fields for All User Types */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-700">Personal Information</p>
                <InputField
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={formData.userName}
                  onChange={handleChange}
                />

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

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <InputField
                  icon={<Calendar className="h-5 w-5 text-gray-400" />} 
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
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
                  name="nationalID"
                  placeholder="National ID Number"
                  value={formData.nationalID}
                  onChange={handleChange}
                />
              </div>

              {/* Consumer Specific Fields */}
              {userType === 'consumer' && (
                <div className="space-y-4">
                  <select
                    name="consumerType"
                    value={formData.consumerType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Consumer Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                  
                  {formData.consumerType === 'Corporate' && (
                    <InputField
                      icon={<Building className="h-5 w-5 text-gray-400" />}
                      type="text"
                      name="associatedCompany"
                      placeholder="Associated Company"
                      value={formData.associatedCompany}
                      onChange={handleChange}
                    />
                  )}
                </div>
              )}

              {/* Agri-Business Specific Fields */}
              {userType === 'agri-business' && (
                <div className="space-y-4">
                  <InputField
                    icon={<Building className="h-5 w-5 text-gray-400" />}
                    type="text"
                    name="agriBusiness.businessName"
                    placeholder="Business Name"
                    value={formData.agriBusiness.businessName}
                    onChange={handleChange}
                  />
                  <textarea
                    name="agriBusiness.businessAddress"
                    placeholder="Business Address"
                    value={formData.agriBusiness.businessAddress}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    rows="2"
                  /> 
                  <textarea
                    name="agriBusiness.businessDescription"
                    placeholder="Business Description"
                    value={formData.agriBusiness.businessDescription}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    rows="3"
                  />
                  
                  <select
                    name="agriBusiness.businessType"
                    value={formData.agriBusiness.businessType}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Business Type</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Distributor">Distributor</option>
                  </select>

                  <InputField
                    icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                    type="text"
                    name="agriBusiness.businessRegistrationNumber"
                    placeholder="Business Registration Number"
                    value={formData.agriBusiness.businessRegistrationNumber}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Farmer Specific Fields */}
              {userType === 'farmer' && (
                <div className="space-y-4">
                  <InputField
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    type="text"
                    name="farmer.farmAddress"
                    placeholder="Farm Address"
                    value={formData.farmer.farmAddress}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    type="number"
                    name="farmer.farmSize"
                    placeholder="Farm Size (acres)"
                    value={formData.farmer.farmSize}
                    onChange={handleChange}
                    step="0.1"
                  />

                  <select
                    name="farmer.specialization"
                    value={formData.farmer.specialization}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Specialization</option>
                    <option value="Crops">Crops</option>
                    <option value="Livestock">Livestock</option>
                    <option value="Mixed">Mixed</option>
                  </select>

                  <InputField
                    icon={<Building className="h-5 w-5 text-gray-400" />}
                    type="number"
                    name="farmer.farmYieldCapacity"
                    placeholder="Annual Yield Capacity"
                    value={formData.farmer.farmYieldCapacity}
                    onChange={handleChange}
                    step="0.1"
                  />
                </div>
              )}

              {/* Security Fields */}
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

              {/* Profile Picture */}
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