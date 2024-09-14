import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/SignIn.css';

function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); // Redirect to home if token exists
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signin', formData);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                navigate('/'); // Redirect to home after successful sign in
            }
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred. Please try again.';
            setError(message);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h1 className="signin-title">Sign in</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            onChange={handleChange}
                            value={formData.email}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            id="password"
                            onChange={handleChange}
                            value={formData.password}
                            className="form-control"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary signin-button"
                    >
                        Sign in
                    </button>
                </form>
                <p className="signin-footer">Don't have an account? <Link to="/signup" className="signin-link">Sign up</Link></p>
            </div>
        </div>
    );
}

export default SignIn;
