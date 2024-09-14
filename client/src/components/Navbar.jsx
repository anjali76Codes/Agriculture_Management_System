// Navbar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="centered-navbar">
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
      </Nav>
    </div>
  );
};

export default Navbar;
