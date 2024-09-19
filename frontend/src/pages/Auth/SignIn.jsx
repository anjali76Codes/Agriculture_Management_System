import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../../styles/Auth/SignIn.css';

function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // Use login function from context
    const { t } = useTranslation(); // Initialize useTranslation

    // Extract the redirect path from query parameters
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect') || '/';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); // Redirect to home if already signed in
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError(t('signin.fillFields')); // Use translation for error message
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signin', formData);

            if (response.status === 200) {
                const { token, username } = response.data; // Expect username and token in response

                // Store all information in a single object
                const userInfo = {
                    token,
                    username,
                    email: formData.email
                };

                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                login(token); // Set authentication state
                navigate(redirectPath); // Redirect to the saved path
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || t('signin.error')); // Use translation for error message
            } else if (error.request) {
                setError(t('signin.noResponse'));
            } else {
                setError(t('signin.error'));
            }
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h1 className="signin-title">{t('signin.title')}</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder={t('signin.emailPlaceholder')}
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder={t('signin.passwordPlaceholder')}
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <button
                        type="submit"
                        className="signin-button"
                    >
                        {t('signin.buttonText')}
                    </button>
                </form>
                <p className="signin-footer">
                    {t('signin.footerText')} <Link to="/signup" className="signin-link">{t('signin.signupLink')}</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
