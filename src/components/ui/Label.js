import React from 'react';

const Label = React.forwardRef(({ className = '', children, htmlFor, required, ...props }, ref) => {
  const baseStyles = `
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
    cursor: default;
  `;

  const requiredStyles = `
    &::after {
      content: "*";
      color: #ef4444;
      margin-left: 4px;
    }
  `;

  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={className}
      style={{ 
        ...props.style,
        cssText: `
          ${baseStyles}
          ${required ? requiredStyles : ''}
        `
      }}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

export default Label;