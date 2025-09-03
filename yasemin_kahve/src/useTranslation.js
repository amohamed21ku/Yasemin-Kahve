// useTranslation.js
import { useLanguage } from './LanguageContext';
import { en, tr } from './languages';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    const translations = language === 'en' ? en : tr;
    return translations[key] || key;
  };
  
  return { t, language };
};