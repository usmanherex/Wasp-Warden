import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Image from '../assets/images/wasp.png';
import Video from '../assets/Videos/clip3.mp4';
const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { identifier: savedIdentifier, rememberMe: savedRememberMe } = JSON.parse(savedCredentials);
      setIdentifier(savedIdentifier);
      setRememberMe(savedRememberMe);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        identifier,
        password
      });

      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify({
          identifier,
          rememberMe
        }));
      } else {
        localStorage.removeItem('savedCredentials');
      }

      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      const dashboardRoutes = {
        'Farmer': '/farmer-dashboard',
        'Agri-business': '/agribusiness-dashboard',
        'Consumer': '/consumer-dashboard'
      };
      
      navigate(dashboardRoutes[response.data.user.userType]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'An error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col justify-between">
      <Link
          to="/home"
          className="group w-fit flex items-center px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 ease-in-out"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
         
          <span className="ml-2 font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md mx-auto w-full my-8 lg:my-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Login to manage your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="identifier"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm transition-all"
                  placeholder="Enter your email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-green-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-700 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8 lg:mt-0">
          © {new Date().getFullYear()} Wasp Warden. All rights reserved.
        </div>
      </div>
      <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-screen relative overflow-hidden">
  {/* Video Background */}
  <video 
    autoPlay 
    loop 
    muted 
    className="absolute inset-0 w-full h-full object-cover"
    style={{ filter: 'brightness(0.7)' }}
  >
    <source src={Video} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Green Tint Overlay */}
  <div className="absolute inset-0 bg-green-600 bg-opacity-15" /> {/* Green tint with 40% opacity */}

  {/* Dark Overlay for better text readability */}
  <div className="absolute inset-0 bg-black bg-opacity-15" /> {/* Dark overlay with 40% opacity */}

  {/* Content */}
  <div className="relative h-full flex flex-col items-center justify-center text-white p-8">
    <div className="max-w-lg text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-green-500">WASP WARDEN</h1>
      <p className="text-lg md:text-xl text-gray-100 drop-shadow-lg">
      Guardians of Growth: Enter the Warden's Realm
      </p>
    </div>
  </div>
</div>

    </div>
  );
};

export default LoginPage;