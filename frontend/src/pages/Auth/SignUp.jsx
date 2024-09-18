import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../../styles/Auth/SignUp.css';

function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize useTranslation

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email || !formData.password) {
            setError(t('signup.fillFields')); // Use translation for error message
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signup', formData);

            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username); // Store username
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || t('signup.error')); // Use translation for error message
            } else if (error.request) {
                setError(t('signup.noResponse'));
            } else {
                setError(t('signup.error'));
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">{t('signup.title')}</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder={t('signup.usernamePlaceholder')}
                            onChange={handleChange}
                            value={formData.username}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder={t('signup.emailPlaceholder')}
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder={t('signup.passwordPlaceholder')}
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <button
                        type="submit"
                        className="signup-button"
                    >
                        {t('signup.buttonText')}
                    </button>
                </form>
                <p className="signup-footer">
                    {t('signup.footerText')} <Link to="/signin" className="signup-link">{t('signup.signinLink')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
