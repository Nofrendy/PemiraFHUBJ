import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-md border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm 
        focus:border-merah-formal focus:ring-merah-formal/20 focus:outline-none focus:ring-4
        transition-all duration-200 border sm:text-sm placeholder:text-gray-400
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} 
        ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
