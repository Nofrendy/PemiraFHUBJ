import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-merah-formal text-white hover:bg-red-900 shadow-[0_2px_10px_-3px_rgba(139,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,0,0,0.4)] focus:ring-merah-formal/50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow focus:ring-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow focus:ring-gray-200 bg-white"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
