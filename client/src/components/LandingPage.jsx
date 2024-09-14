import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // Ensure corresponding styles exist in CSS

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup'); // Redirect to SignUp page
  };

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>What's Things in Season?</h1>
          <p>Your guide to eating seasonally</p>
          <button onClick={handleSignUp} className="hero-button">
            Sign Up
          </button>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
