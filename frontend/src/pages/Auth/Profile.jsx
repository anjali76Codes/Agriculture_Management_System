import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Auth/Profile.css';

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
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
          logout(); 
          navigate('/signin');
        } else {
          setError(t('profile.fetchError'));
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, isAuthenticated, logout, t]);

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
      setError(t('profile.updateError'));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('profile.passwordMismatch'));
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
      setError(t('profile.passwordSuccess'));
    } catch (error) {
      setError(t('profile.passwordUpdateError'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return <div>{t('profile.loading')}</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="text-center">{t('profile.title')}</h1>
        {editMode ? (
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">{t('profile.username')}</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder={t('profile.usernamePlaceholder')}
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">{t('profile.email')}</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t('profile.emailPlaceholder')}
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <button type="submit" className="bttn btn-primary mb-3">
              {t('button.saveChanges')}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bttn pbtn"
            >
              {t('button.cancel')}
            </button>
          </form>
        ) : passwordMode ? (
          <form onSubmit={handlePasswordSubmit} className="d-flex flex-column">
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">{t('profile.currentPassword')}</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                placeholder={t('profile.currentPasswordPlaceholder')}
                onChange={handlePasswordChange}
                value={passwordData.oldPassword}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">{t('profile.newPassword')}</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder={t('profile.newPasswordPlaceholder')}
                onChange={handlePasswordChange}
                value={passwordData.newPassword}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">{t('profile.confirmPassword')}</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder={t('profile.confirmPasswordPlaceholder')}
                onChange={handlePasswordChange}
                value={passwordData.confirmPassword}
              />
            </div>
            <button type="submit" className="bttn pbtn btn-primary mb-3">
              {t('button.changePassword')}
            </button>
            <button
              type="button"
              onClick={() => setPasswordMode(false)}
              className="bttn pbtn btn-secondary"
            >
              {t('button.cancel')}
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-4">{t('profile.welcome')}, {userData.username}!</p>
            <p className="mb-4">{t('profile.email')}: {userData.email}</p>
            <button
              onClick={() => setEditMode(true)}
              className="bttn pbtn btn-primary"
            >
              {t('button.editProfile')}
            </button>
            <button
              onClick={() => setPasswordMode(true)}
              className="bttn pbtn btn-secondary"
            >
              {t('button.changePassword')}
            </button>
            <button
              onClick={handleLogout}
              className="bttn pbtn btn-danger"
            >
              {t('button.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
