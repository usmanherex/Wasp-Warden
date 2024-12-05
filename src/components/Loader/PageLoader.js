import React from 'react';

const PageLoader = () => {
  return (
    <div className="relative w-full h-1 bg-gray-100 overflow-hidden">
      {/* Primary loading bar */}
      <div 
        className="absolute top-0 left-0 h-full bg-green-500 animate-shimmer"
        style={{
          width: '30%',
          animation: 'loading 2s infinite linear',
          '@keyframes loading': {
            '0%': {
              transform: 'translateX(-100%)'
            },
            '100%': {
              transform: 'translateX(400%)'
            }
          }
        }}
      />
      
      {/* Secondary loading bar for additional effect */}
      <div 
        className="absolute top-0 left-0 h-full bg-green-400 animate-shimmer opacity-50"
        style={{
          width: '20%',
          animation: 'loading 2s infinite linear 0.5s',
          '@keyframes loading': {
            '0%': {
              transform: 'translateX(-100%)'
            },
            '100%': {
              transform: 'translateX(400%)'
            }
          }
        }}
      />
    </div>
  );
};

export default PageLoader;