import React from 'react';

const LoadingSpinner = ({ darkMode = false }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className={`w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${darkMode ? 'border-blue-400' : 'border-blue-600'}`} />
        <div className={`w-16 h-16 rounded-full border-4 border-l-transparent animate-spin absolute top-0 left-0 animation-delay-150 ${darkMode ? 'border-green-400' : 'border-green-600'}`} style={{ animationDelay: '0.15s' }} />
        <div className={`w-16 h-16 rounded-full border-4 border-r-transparent animate-spin absolute top-0 left-0 animation-delay-300 ${darkMode ? 'border-purple-400' : 'border-purple-600'}`} style={{ animationDelay: '0.3s' }} />
      </div>
      <p className={`mt-4 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Loading dashboard data...</p>
    </div>
  );
};

export default LoadingSpinner;