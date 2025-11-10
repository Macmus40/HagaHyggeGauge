
import React from 'react';
import type { Ease } from '../App';
import { translations } from '../locales/translations';

interface EaseSelectorProps {
  currentEase: Ease;
  setEase: (ease: Ease) => void;
  baseCircumference: string;
  adjustedCircumference: number | null;
  t: (key: keyof typeof translations.en) => string;
}

const easeOptions: Ease[] = ['snug', 'exact', 'loose'];

export const EaseSelector: React.FC<EaseSelectorProps> = ({ 
  currentEase, 
  setEase,
  baseCircumference,
  adjustedCircumference,
  t 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-text mb-2">{t('ease_title')}</label>
      <div className="grid grid-cols-3 gap-2 bg-brand-bg p-1 rounded-xl">
        {easeOptions.map((ease) => (
          <button
            key={ease}
            type="button"
            onClick={() => setEase(ease)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-bg focus:ring-brand-accent ${
              currentEase === ease
                ? 'bg-brand-subtle-bg text-brand-accent shadow-sm'
                : 'text-brand-primary hover:bg-brand-subtle-bg/60'
            }`}
          >
            {t(`ease_${ease}_label`)}
            <span className="block text-xs opacity-80">{t(`ease_${ease}_value`)}</span>
          </button>
        ))}
      </div>
      <div className="text-center text-sm text-brand-primary mt-3 h-10 flex items-center justify-center">
        {parseFloat(baseCircumference) > 0 && adjustedCircumference !== null ? (
          <p>
            {t('ease_final_circumference_label')}{' '}
            <strong className="text-brand-text">{adjustedCircumference.toFixed(1)} {t('unit_cm')}</strong>.
            <br/>
            <span className="text-xs">
              {t(`ease_${currentEase}_description`)}
            </span>
          </p>
        ) : (
           <p className="text-xs">{t(`ease_${currentEase}_description`)}</p>
        )}
      </div>
    </div>
  );
};