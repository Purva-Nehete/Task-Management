import { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-black text-white hover:bg-gray-800',
    secondary:
      'border bg-white text-gray-900 hover:bg-gray-50',
    ghost:
      'text-gray-600 hover:bg-gray-100',
    danger:
      'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}