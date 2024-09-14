import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth/SignUp.css';

function SignUp() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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

        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signup', formData);
            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username);
                navigate('/'); // Redirect to home page after successful signup
            }
        } catch (error) {
            const message = error.response?.data?.message || 'An error occurred. Please try again.';
            setError(message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Sign up</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            id="username"
                            onChange={handleChange}
                            value={formData.username}
                            className="form-control"
                        />
                    </div>
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
                        className="btn btn-primary signup-button"
                    >
                        Signup
                    </button>
                </form>
                <p className="signup-footer">Already have an account? <Link to="/signin" className="signup-link">Sign in</Link></p>
            </div>
        </div>
    );
}

export default SignUp;
