import React from 'react';

export const Card = ({ children, className }) => {
  return <div className={` shadow rounded-lg ${className}`}>{children}</div>;
};