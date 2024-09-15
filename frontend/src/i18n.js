// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../src/locales/en/translation.json';
import hiTranslation from '../src/locales/hi/translation.json';
import mrTranslation from '../src/locales/mr/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            hi: { translation: hiTranslation },
            mr: { translation: mrTranslation },
        },
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
    });

export default i18n;
