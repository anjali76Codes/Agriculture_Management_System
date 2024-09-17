import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth/SignUp.css'

function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            setError('Please fill in all fields');
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
                setError(error.response.data.message || 'An error occurred. Please try again.');
            } else if (error.request) {
                setError('No response from the server. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
    <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">SIGNUP</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        {/* <label htmlFor="username" className="form-label">Username</label> */}
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                    </div>
                    <div className="form-group">
                        {/* <label htmlFor="email" className="form-label">Email</label> */}
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="form-group">
                        {/* <label htmlFor="password" className="form-label">Password</label> */}
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
                        className="signup-button"
                    >
                        Signup
                    </button>
                </form>
                <p className="signup-footer">
                    Already have an account? <Link to="/signin" className="signup-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
