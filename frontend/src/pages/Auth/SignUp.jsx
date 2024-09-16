// src/pages/Auth/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function SignUp() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Use login function from context

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

        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/signup', formData);

            if (response.status === 201) {
                const { token, username } = response.data; // Expect username in response
                localStorage.setItem('token', token);
                localStorage.setItem('username', username); // Store username
                login(token); // Set authentication state
                navigate('/'); // Redirect to home
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'An error occurred. Please try again.');
            } else if (error.request) {
                setError('No response from the server. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '400px' }}>
                <h1 className="h3 mb-4 text-primary">Sign up</h1>
                {error && <div className="alert alert-danger mb-4">{error}</div>}
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
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                    >
                        Signup
                    </button>
                </form>
                <p className="text-center">
                    Already have an account? <Link to="/signin" className="link-primary">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
