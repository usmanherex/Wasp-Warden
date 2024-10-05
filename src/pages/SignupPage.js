import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Implement sign-up logic here
    navigate('/home');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="text-center">
          <img src="/images/wasp.png" alt="Logo" width={150} className="mx-auto mb-4" />
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign Up</h3>
        </div>
        <form onSubmit={handleSignUp} className="mt-6 space-y-5">
          <div className="mb-4">
            <label htmlFor="userType" className="block text-gray-700 font-medium mb-2">
              What do you wish to sign up as?
            </label>
            <div className="flex justify-around">
              <label className="flex items-center">
                <input
                  id="farmer"
                  type="radio"
                  name="userType"
                  value="farmer"
                  checked={userType === 'farmer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Farmer
              </label>
              <label className="flex items-center">
                <input
                  id="agri-business"
                  type="radio"
                  name="userType"
                  value="agri-business"
                  checked={userType === 'agri-business'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Agri-Business
              </label>
              <label className="flex items-center">
                <input
                  id="consumer"
                  type="radio"
                  name="userType"
                  value="consumer"
                  checked={userType === 'consumer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Consumer
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
            />
          </div>

          {userType === 'agri-business' && (
            <div>
              <label htmlFor="phoneNumber" className="font-medium">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
              />
            </div>
          )}

          {userType === 'consumer' && (
            <div>
              <label htmlFor="cnic" className="font-medium">CNIC</label>
              <input
                type="text"
                id="cnic"
                placeholder="Enter your CNIC"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-400 shadow-sm rounded-lg"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-lg duration-150"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-600 hover:text-yellow-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
