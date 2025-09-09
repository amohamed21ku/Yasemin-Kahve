// LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage or browser language
    const savedLanguage = localStorage.getItem('cafe-del-belo-language');
    if (savedLanguage) return savedLanguage;
    
    // Default to Turkish if browser language is Turkish, otherwise English
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('tr') ? 'tr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('cafe-del-belo-language', language);
    // Also set the 'language' key for compatibility with services
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'tr' : 'en');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};