// components/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  // Base classes that will be applied to all buttons
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  // Variant classes
  const variants = {
    default: "bg-green-600 text-white shadow hover:bg-green-700 active:bg-green-800",
    destructive: "bg-red-500 text-white shadow hover:bg-red-600 active:bg-red-700",
    outline: "border border-green-500 text-green-600 bg-transparent hover:bg-green-50 active:bg-green-100",
    secondary: "bg-green-100 text-green-900 shadow hover:bg-green-200 active:bg-green-300",
    ghost: "text-green-600 hover:bg-green-50 active:bg-green-100",
    link: "text-green-600 underline-offset-4 hover:underline"
  };

  // Size classes
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10"
  };

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;