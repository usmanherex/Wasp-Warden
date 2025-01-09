// components/ui/card.jsx
import React from 'react';

export function Card({ className, children }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={`px-6 py-4 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={`text-2xl font-semibold ${className || ''}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={`px-6 py-4 ${className || ''}`}>
      {children}
    </div>
  );
}