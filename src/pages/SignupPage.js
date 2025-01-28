import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Lock, Building, MapPin, Upload, ArrowLeft, Calendar } from 'lucide-react';
import logo from '../assets/images/wasp.png';
import Image from '../assets/images/farmer_signup.jpg';
import axios from 'axios';
import { toast } from "react-toastify";
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
    consumerType: '',
    associatedCompany: '',
    agriBusiness: {
      businessName: '',
      businessAddress: '',
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
    if (formData.password !== formData.confirmPassword) {
      
      toast.error("Passwords do not match", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
      return;
    }

    const formPayload = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'agriBusiness' && key !== 'farmer' && formData[key] !== null) {
        formPayload.append(key, formData[key]);
      }
    });
    
    formPayload.append('userType', userType.charAt(0).toUpperCase() + userType.slice(1));

    switch (userType) {
      case 'consumer':
        formPayload.append('consumerType', formData.consumerType);
        if (formData.consumerType === 'Corporate') {
          formPayload.append('associatedCompany', formData.associatedCompany);
        }
        break;
      case 'agri-business':
        Object.keys(formData.agriBusiness).forEach(key => {
          formPayload.append(key, formData.agriBusiness[key]);
        });
        break;
      case 'farmer':
        Object.keys(formData.farmer).forEach(key => {
          formPayload.append(key, formData.farmer[key]);
        });
        break;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
     
      toast.success("Registration Successful!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
      navigate('/login');
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      toast.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'), {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });


    }
  };

  return (
    <div className="h-screen w-screen flex">

<Link
    to="/login"
    className="absolute top-8 left-8 z-50 flex items-center px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
>
    <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
    <span className="ml-2 font-medium">Back to Login</span>
</Link>
      {/* Left Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative">
        <img 
          src={Image} 
          alt="Farmer Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      
        <div className="relative z-10 p-12 flex items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              CREATE YOUR ACCOUNT
            </h1>
            <p className="text-xl">
              It looks like you don't have an account with us yet. Please complete your information below to finish creating your account.
            </p>
          </div>
        </div>
      </div>
     
      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 bg-white overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <img src={logo} alt="Logo" className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Sign Up Now</h2>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* User Type Selection */}
            <div className="flex justify-between gap-4 mb-8">
              {['consumer', 'farmer', 'agri-business'].map((type) => (
                <div
                  key={type}
                  className={`cursor-pointer p-4 rounded-lg text-center flex-1 transition-colors ${
                    userType === type 
                      ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setUserType(type)}
                >
                  <p className="text-sm font-medium capitalize">{type}</p>
                </div>
              ))}
            </div>

            {/* Common Fields */}
            <div className="space-y-4">
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
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
              </div>

              <InputField
                icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                type="text"
                name="nationalID"
                placeholder="National ID Number"
                value={formData.nationalID}
                onChange={handleChange}
              />
            </div>

            {/* Conditional Fields Based on User Type */}
            {userType === 'consumer' && (
              <div className="space-y-4">
                <select
                  name="consumerType"
                  value={formData.consumerType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
                  rows="2"
                />
                <textarea
                  name="agriBusiness.businessDescription"
                  placeholder="Business Description"
                  value={formData.agriBusiness.businessDescription}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
                  rows="3"
                />
                <select
                  name="agriBusiness.businessType"
                  value={formData.agriBusiness.businessType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-green-500 focus:border-green-500"
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

            {/* Password Fields */}
            <div className="space-y-4">
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

            {/* Profile Picture Upload */}
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
  
              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Create Account
                </button>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  const InputField = ({ icon, type, name, placeholder, value, onChange, step }) => (
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
        step={step}
        required
      />
    </div>
  );
  
  export default SignUpPage;