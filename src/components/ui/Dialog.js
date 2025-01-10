// src/components/ui/dialog.jsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Dialog = ({ children, open, onOpenChange }) => {
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { open, onOpenChange })
  );
};

export const DialogTrigger = ({ children, asChild, open, onOpenChange }) => {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange?.(!open),
    });
  }
  return (
    <button onClick={() => onOpenChange?.(!open)}>
      {children}
    </button>
  );
};

export const DialogContent = ({ children, open, onOpenChange }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={ref}
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};