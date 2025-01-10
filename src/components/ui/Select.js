// src/components/ui/select.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ children, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { value });
        }
        return React.cloneElement(child, { value, onChange: setValue });
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, value }) => {
  return (
    <button className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-50">
      {value ? children : "Select an option"}
      <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  );
};

export const SelectContent = ({ children, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)}>
        {React.Children.map(children, (child) => {
          if (child.type === SelectTrigger) {
            return child;
          }
          return null;
        })}
      </div>
      {isOpen && (
        <div 
          ref={ref}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
        >
          {React.Children.map(children, (child) => {
            if (child.type === SelectItem) {
              return React.cloneElement(child, {
                onSelect: (selectedValue) => {
                  onChange(selectedValue);
                  setIsOpen(false);
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </>
  );
};

export const SelectItem = ({ children, value, onSelect }) => {
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder, children }) => {
  return <span>{children || placeholder}</span>;
};