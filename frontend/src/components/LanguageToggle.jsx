import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap'; // Import Bootstrap Button components
import "../styles/LanguageToggle.css";

const LanguageSwitcher = ({ handleLanguageChange, t }) => {
  return (
    <div className="language-buttons mb-4">
      <ButtonGroup>
        <Button variant="link" onClick={() => handleLanguageChange('en')}>
          English
        </Button>
        <span>|</span>
        <Button variant="link" onClick={() => handleLanguageChange('hi')}>
          हिंदी
        </Button>
        <span>|</span>
        <Button variant="link" onClick={() => handleLanguageChange('mr')}>
          मराठी
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LanguageSwitcher;
