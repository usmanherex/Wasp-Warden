import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic here
    navigate('/home');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center pb-4">
          <img src="/assets/images/wasp.png" alt="Logo" width={150} className="mx-auto" />
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl mt-2">Log in to your account</h3>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="font-medium">
              Email
            </label>
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
          <div>
            <label htmlFor="password" className="font-medium">
              Password
            </label>
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
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-x-3">
              <input type="checkbox" id="remember-me-checkbox" className="checkbox-item peer hidden" />
              <label
                htmlFor="remember-me-checkbox"
                className="relative flex w-5 h-5 bg-white peer-checked:bg-yellow-400 rounded-md border ring-offset-2 ring-yellow-400 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
              />
              <span>Remember me</span>
            </div>
            <a href="javascript:void(0)" className="text-center text-yellow-600 hover:text-yellow-500">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 rounded-lg duration-150"
          >
            Sign in
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-yellow-600 hover:text-yellow-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
