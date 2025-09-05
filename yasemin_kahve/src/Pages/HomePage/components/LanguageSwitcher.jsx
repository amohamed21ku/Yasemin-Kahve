// LanguageSwitcher.jsx - Language toggle component
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      aria-label={`Switch to ${language === 'en' ? 'Turkish' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'Türkçe' : 'English'}`}
    >
      <Globe size={18} />
      <span className="language-text">{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;