import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-toggle">
            <button onClick={() => handleLanguageChange('en')}>English</button>
            <button onClick={() => handleLanguageChange('hi')}>हिन्दी</button>
            <button onClick={() => handleLanguageChange('mr')}>मराठी</button>
        </div>
    );
};

export default LanguageToggle;
