import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md px-4 py-2 ${
        variant === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200'
      } ${className}`}
      {...props}
    />
  );
}