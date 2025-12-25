/**
 * Button Component - Componente de botão básico
 * 
 * T064: Botão com Tailwind, onClick, disabled, children
 */

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  onClick,
  disabled = false,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-bold rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}

