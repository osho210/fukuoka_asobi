'use client';

import React from 'react';
import styles from '@/styles/Button.module.css';

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
    styles.button,
    variant === 'primary' ? styles.primaryButton :
    variant === 'secondary' ? styles.secondaryButton :
    styles.outlineButton,
    size === 'sm' ? styles.smallButton :
    size === 'lg' ? styles.largeButton :
    styles.mediumButton,
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
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
