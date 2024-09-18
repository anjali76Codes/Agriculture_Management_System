import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from 'react-i18next'; // Import useTranslation for multilingual support
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation(); // Initialize translation function
  const location = useLocation(); // Get current location to handle conditional rendering

  return (
    <div className="navbar">
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link href="/">{t('navbar.home')}</Nav.Link> {/* Use translated text for Home */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">{t('navbar.about')}</Nav.Link> {/* Use translated text for About */}
        </Nav.Item>
        {
          isAuthenticated && (
            <Nav.Item>
              <Nav.Link href="/profile">{t('navbar.profile')}</Nav.Link> {/* Show Profile if authenticated */}
            </Nav.Item>
          )
        }
        {
          !isAuthenticated && location.pathname === '/signin' ? (
            <Nav.Item>
              <Nav.Link href="/signup">{t('navbar.signup')}</Nav.Link> {/* Show Signup when on /signin */}
            </Nav.Item>
          ) : (
            !isAuthenticated && (
              <Nav.Item>
                <Nav.Link href="/signin">{t('navbar.signin')}</Nav.Link> {/* Show Signin if not authenticated */}
              </Nav.Item>
            )
          )
        }
        <h2><ion-icon name="leaf"></ion-icon>Agri<p>Circle</p></h2> {/* Branding */}
      </Nav>
    </div>
  );
};

export default Navbar;
