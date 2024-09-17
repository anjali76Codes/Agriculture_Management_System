import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // Ensure corresponding styles exist in CSS
import Plant from '../assets/plant.gif'
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup'); // Redirect to SignUp page
  };

  return (
    <main className="landing-page">
      {/* <Navbar></Navbar> */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>What's Things in Season?</h1>
          <p>Your helper in the community!</p>
          <button onClick={handleSignUp} className="hero-button">
            Get Started !
          </button>
        </div>
        <img src={Plant}></img>
      </section>
    </main>
  );
};

export default LandingPage;