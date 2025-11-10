
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-text mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-brand-bg border border-brand-soft-accent text-brand-text rounded-lg p-3 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
        step="0.1"
        {...props}
      />
    </div>
  );
};
