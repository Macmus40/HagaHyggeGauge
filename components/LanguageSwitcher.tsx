
import React from 'react';

// --- Flag SVG Components ---
const GBFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48" width="28" height="18" {...props}><path fill="#012169" d="M0 0h72v48H0z"/><path fill="#FFF" d="M0 0v3l66 42h6v-3L6 3H0zm72 0v3L6 45H0v-3l66-42h6z"/><path fill="#FFF" d="M29.5 0v48h13V0h-13zm-29.5 17.5v13h72v-13h-72z"/><path fill="#C8102E" d="M0 20.5v7h72v-7H0zM32.5 0v48h7V0h-7zM0 0l24 16V0H0zm48 0h24v16L48 0zM0 48l24-16V48H0zm48 48h24V32l-24 16z"/></svg>
);
const USFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48" width="28" height="18" {...props}><path fill="#eee" d="M0 0h72v48H0z"/><path fill="#3c3b6e" d="M0 0h36v24H0z"/><path fill="#eee" d="m6 3 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm12 0 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm12 0 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zM0 9l1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm12 0 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm12 0 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm-6 6 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3zm12 0 1 3h3l-2 2 1 3-3-2-3 2 1-3-2-2h3z"/><path fill="#b22234" d="M36 0h36v4H0v4h36v4H0v4h36v4H0v4h36v4H0v4h72v4H0v4h72v4H0v4h72v4H0v4h72v4H0v4h72v4H0z"/></svg>
);
const ESFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48" width="28" height="18" {...props}><path fill="#c60b1e" d="M0 0h72v12h-72z"/><path fill="#ffc400" d="M0 12h72v24h-72z"/><path fill="#c60b1e" d="M0 36h72v12h-72z"/><g transform="translate(21 18) scale(.6)"><path fill="#c60b1e" d="M6 0h4v16h-4zM20 0h4v16h-4z"/><path fill="#ad1519" d="M15 11v-11h-10v11l5 5z"/><path fill="#ffc400" d="M15 11h-10v-9h10z"/><path fill="#c60b1e" d="M15 2h-10v7h10z"/><path fill="#706a4a" d="M10 2h-4v3h4zM14 2h-4v3h4z"/><circle fill="#ad1519" r="2" cy="19" cx="10"/><path fill="#ad1519" d="M0 16h30v4h-30z"/><path fill="#ffc400" d="M0 20h30v3h-30z"/><path fill="#ad1519" d="M0 23h30v4h-30z"/></g></svg>
);
const FRFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48" width="28" height="18" {...props}><path fill="#fff" d="M0 0h72v48H0z"/><path fill="#002654" d="M0 0h24v48H0z"/><path fill="#ce1126" d="M48 0h24v48H48z"/></svg>
);
const DEFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 48" width="28" height="18" {...props}><path fill="#000" d="M0 0h72v16H0z"/><path fill="#d00" d="M0 16h72v16H0z"/><path fill="#ffce00" d="M0 32h72v16H0z"/></svg>
);

interface LanguageSwitcherProps {
  currentLang: string;
  setLang: (lang: 'en' | 'en-US' | 'es' | 'fr' | 'de') => void;
}

const languages = [
  { code: 'en', Flag: GBFlag, name: 'English (UK)' },
  { code: 'en-US', Flag: USFlag, name: 'English (US)' },
  { code: 'es', Flag: ESFlag, name: 'Español' },
  { code: 'fr', Flag: FRFlag, name: 'Français' },
  { code: 'de', Flag: DEFlag, name: 'Deutsch' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, setLang }) => {
  return (
    <div className="flex space-x-1 rtl:space-x-reverse bg-brand-subtle-bg/50 p-1 rounded-full">
      {languages.map(({ code, Flag, name }) => (
        <button
          key={code}
          onClick={() => setLang(code as any)}
          className={`group p-1 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent ${
            currentLang === code ? 'bg-brand-soft-accent shadow-inner' : 'hover:bg-brand-bg'
          }`}
          aria-label={`Switch to ${name}`}
          title={name}
        >
          <Flag className={`transition-all duration-300 ease-in-out ${currentLang === code ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
        </button>
      ))}
    </div>
  );
};
