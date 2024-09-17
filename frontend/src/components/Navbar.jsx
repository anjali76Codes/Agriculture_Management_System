// Navbar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav.Item>
        <h2><ion-icon name="leaf"></ion-icon>Agri<p>Circle</p></h2>
      </Nav>
    </div>
  );
};

export default Navbar;
