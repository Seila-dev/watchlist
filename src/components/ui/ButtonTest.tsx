"use client"

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'rounded px-4 py-2 font-medium transition-colors';
  const primaryStyles = 'bg-blue-600 text-white hover:bg-blue-700';
  const secondaryStyles = 'bg-gray-200 text-black hover:bg-gray-300';

  const variantStyles = variant === 'secondary' ? secondaryStyles : primaryStyles;

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}