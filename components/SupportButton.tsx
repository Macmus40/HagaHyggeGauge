import React from 'react';
import { YarnIcon } from './icons/YarnIcon';

interface SupportButtonProps {
  kofiId: string;
  label: string;
}

export const SupportButton: React.FC<SupportButtonProps> = ({ kofiId, label }) => {
  const kofiUrl = `https://ko-fi.com/${kofiId}`;

  return (
    <a
      href={kofiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-3 text-base font-medium text-brand-text bg-brand-bg border border-brand-soft-accent rounded-full px-4 py-2 mt-2 transition-colors duration-200 hover:bg-brand-soft-accent/40 hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-result-bg focus:ring-brand-accent"
    >
      <YarnIcon className="w-6 h-6" />
      <span>{label}</span>
    </a>
  );
};