import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="bg-brand-accent text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-200 border border-transparent dark:border-brand-soft-accent"
      {...props}
    >
      {children}
    </button>
  );
};
