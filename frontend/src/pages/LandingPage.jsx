import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Remove the second import of useAuth
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap'; // Import Dropdown from react-bootstrap
import '../styles/LandingPage.css'; // Ensure corresponding styles exist in CSS
import Plant from '../assets/plant.gif';

const LandingPage = () => {
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
  const { isAuthenticated } = useAuth(); // Get authentication status
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/browse'); // Redirect to browse if authenticated
    } else {
      navigate('/signin'); // Redirect to sign in if not authenticated
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng); // Change the language
  };

  const browse = () => {
    navigate('/browse');
  };

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>{t('landing.title')}</h1>
          <p>{t('landing.description')}</p>
          <button onClick={handleGetStartedClick} className="hero-button">
            {isAuthenticated ? t('landing.browseProducts') : t('landing.getStarted')}
          </button>
        </div>
        <img src={Plant} alt="Farming" className="hero-image" />
      </section>

      {/* The following section is commented out as per your request */}
      {/* <Dropdown className="language-dropdown mb-4">
        <Dropdown.Toggle variant="success" id="language-dropdown">
          {t('language')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleLanguageChange('en')}>English</Dropdown.Item>
          <Dropdown.Item onClick={() => handleLanguageChange('hi')}>हिंदी</Dropdown.Item>
          <Dropdown.Item onClick={() => handleLanguageChange('mr')}>मराठी</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}
    </main>
  );
};

export default LandingPage;
