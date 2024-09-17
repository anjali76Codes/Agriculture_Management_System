// src/pages/LandingPage.jsx
import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/browse');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="landing-page">
      <header className="hero-section">
        <Container>
          <Row className="align-items-center text-center text-md-left">
            <Col md={6} className="hero-text">
              <h1 className="display-4 animated fadeIn">Revolutionize Your Farming</h1>
              <p className="lead animated fadeIn">Advanced management tools for modern farmers. Optimize your crops and streamline operations with ease.</p>
              {/* Button text changes based on authentication status */}
              <Button
                variant="primary"
                size="lg"
                className="animated fadeIn"
                onClick={handleGetStartedClick}
              >
                {isAuthenticated ? 'Browse Products' : 'Get Started'}
              </Button>
            </Col>
            <Col md={6} className="hero-image">
              <img src="https://via.placeholder.com/600x400" alt="Farming" className="img-fluid animated fadeIn" />
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default LandingPage;
