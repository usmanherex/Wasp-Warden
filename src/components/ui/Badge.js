import React from 'react';

const BadgeComponent = ({ children, variant = "default", className = "" }) => {
  const getVariantClasses = () => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-primary-100 text-primary-800",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800",
      outline: "border border-gray-200 text-gray-800"
    };

    return variants[variant] || variants.default;
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full 
        px-3 py-1 text-sm font-medium
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default BadgeComponent;