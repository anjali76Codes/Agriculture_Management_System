import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      // If no token, redirect to signin page
      navigate('/signin');
    } else {
      // Set username if token exists
      setUsername(storedUsername || '');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    localStorage.removeItem('username'); // Clear username from local storage
    navigate('/signin'); // Navigate to signin page
  };

  // You might want to show a loading state until the authentication check is complete
  if (username === '') {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h1 className="h3 mb-4 text-primary">Home</h1>
        <p className="mb-4">Welcome, {username}!</p>
        <button
          onClick={handleLogout}
          className="btn btn-primary w-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
