import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Navbar from './Navbar';
import '../styles/Home.css'; // Import custom CSS

const Home = () => {
  const navigate = useNavigate();

  // Retrieve the token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // If no token is found, redirect to signin page
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  // Retrieve the username from local storage
  const username = localStorage.getItem('username') || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    localStorage.removeItem('username'); // Clear username from local storage
    navigate('/signin'); // Navigate to signin page
  };

  return (
    <div className="home-container">
      <div className="center-box">
        <Sidebar />
        <div className="main-content">
          {/* <Navbar /> */}
          <h1>Welcome to the Homepage</h1>
          <p>Welcome, {username}!</p>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
