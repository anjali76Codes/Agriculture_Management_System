// Navbar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get the current location

  return (
    <div className="navbar">
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>
        {
          isAuthenticated &&
          <Nav.Item>
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav.Item>
        }
        {
          !isAuthenticated && location.pathname === '/signin' ? (
            <Nav.Item>
              <Nav.Link href="/signup">Signup</Nav.Link> {/* Show Signup when on /signin */}
            </Nav.Item>
          ) : (
            !isAuthenticated && (
              <Nav.Item>
                <Nav.Link href="/signin">Signin</Nav.Link> {/* Show Signin otherwise */}
              </Nav.Item>
            )
          )
        }
        <h2><ion-icon name="leaf"></ion-icon>Agri<p>Circle</p></h2>
      </Nav>
    </div>
  );
};

export default Navbar;