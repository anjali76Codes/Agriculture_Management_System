import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // Retrieve the username from local storage
  const username = localStorage.getItem('username') || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    localStorage.removeItem('username'); // Clear username from local storage
    navigate('/signin'); // Navigate to signin page
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '500px' }}>
        <h1 className="display-4 text-primary mb-4">Home</h1>
        <p className="mb-4">Welcome, {username}!</p>
        <button
          onClick={handleLogout}
          className="btn btn-primary btn-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
