import React from 'react';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../styles/Navbar.css';

const Navbar = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="navbar">
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link href="/">{t('navbar.home')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">{t('navbar.about')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/profile">{t('navbar.profile')}</Nav.Link>
        </Nav.Item>
        <h2><ion-icon name="leaf"></ion-icon>Agri<p>Circle</p></h2>
      </Nav>
    </div>
  );
};

export default Navbar;
