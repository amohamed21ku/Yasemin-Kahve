// useTranslate.js
import { useLanguage } from './LanguageContext';
import { en } from './languages/en';
import { tr } from './languages/tr';

export const useTranslate = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    const translations = language === 'en' ? en : tr;
    return translations[key] || key;
  };
  
  return { t, language };
};