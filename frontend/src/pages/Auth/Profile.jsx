// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Auth/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, username, login, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
        });
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout(); // Clear auth state and navigate to signin
          navigate('/signin');
        } else {
          setError('Failed to fetch user data. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isAuthenticated, logout]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put('http://localhost:3000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      setError('Failed to update user data. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/update-password', passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMode(false);
      setError('Password updated successfully.');
    } catch (error) {
      setError('Failed to update password. Please try again.');
    }
  };

  const handleLogout = () => {
    logout(); // Clear auth state
    navigate('/signin');
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Display error message
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '600px' }}>
        <h1 className="h3 mb-4 text-primary">Profile</h1>
        {editMode ? (
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-3">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        ) : passwordMode ? (
          <form onSubmit={handlePasswordSubmit} className="d-flex flex-column">
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                placeholder="Current Password"
                onChange={handlePasswordChange}
                value={passwordData.oldPassword}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New Password"
                onChange={handlePasswordChange}
                value={passwordData.newPassword}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm New Password"
                onChange={handlePasswordChange}
                value={passwordData.confirmPassword}
              />
            </div>
            <button type="submit" className="btn btn-primary mb-3">
              Update Password
            </button>
            <button
              type="button"
              onClick={() => setPasswordMode(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-4">Welcome, {userData.username}!</p>
            <p className="mb-4">Email: {userData.email}</p>
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-primary mb-3"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setPasswordMode(true)}
              className="btn btn-warning mb-3"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger mb-3"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
