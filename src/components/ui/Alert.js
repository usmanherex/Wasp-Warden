import * as React from "react";

const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const baseStyles = "relative w-full rounded-lg border p-4 transition-all duration-200 ease-in-out";
  
  const variantStyles = {
    default: "bg-background text-foreground",
    destructive: "border-red-200 bg-red-50 text-red-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
    success: "border-green-200 bg-green-50 text-green-900"
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return (
    <div
      ref={ref}
      role="alert"
      className={combinedClassName}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => {
  const baseStyles = "mt-2 text-sm leading-relaxed tracking-normal opacity-90";
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return (
    <div
      ref={ref}
      className={combinedClassName}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
