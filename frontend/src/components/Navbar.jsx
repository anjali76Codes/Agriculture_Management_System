import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import LanguageSwitcher from './LanguageToggle';
import { FaTimes} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <button className="menu-button" onClick={toggleMenu}>
        <ion-icon name="grid" size="larger"></ion-icon>        
        </button>
        <h2>
          <ion-icon name="leaf"></ion-icon>Agri<p>Circle</p>
        </h2>
      </div>
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
      <FaTimes className='close'onClick={toggleMenu}/>
        <Nav className="justify-content-center">
          <Nav.Item>
            <Nav.Link href="/">{t('navbar.home')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/about">{t('navbar.about')}</Nav.Link>
          </Nav.Item>
          {isAuthenticated && (
            <Nav.Item>
              <Nav.Link href="/profile">{t('navbar.profile')}</Nav.Link>
            </Nav.Item>
          )}
          {!isAuthenticated && location.pathname === '/signin' ? (
            <Nav.Item>
              <Nav.Link href="/signup">{t('navbar.signup')}</Nav.Link>
            </Nav.Item>
          ) : (
            !isAuthenticated && (
              <Nav.Item>
                <Nav.Link href="/signin">{t('navbar.signin')}</Nav.Link>
              </Nav.Item>
            )
          )}
        </Nav>
        <div className="language-dropdown">
          <LanguageSwitcher handleLanguageChange={handleLanguageChange} t={t} />
        </div>
        {/* <button className='close'><ion-icon name="close"></ion-icon></button> */}
      </div>
    </div>
  );
};

export default Navbar;
