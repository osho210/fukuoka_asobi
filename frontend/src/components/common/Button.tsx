'use client';

import React from 'react';
import '@/styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  // スタイルクラスの組み合わせ
  const buttonClasses = [
    'button',
    variant === 'primary' ? 'primaryButton' :
    variant === 'secondary' ? 'secondaryButton' :
    'outlineButton',
    size === 'sm' ? 'smallButton' :
    size === 'lg' ? 'largeButton' :
    'mediumButton',
    fullWidth ? 'fullWidth' : '',
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
