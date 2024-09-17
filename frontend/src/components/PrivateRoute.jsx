// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Save the attempted path in the state
    const redirectPath = location.pathname;

    return token ? (
        <Component {...rest} />
    ) : (
        <Navigate to={`/signin?redirect=${encodeURIComponent(redirectPath)}`} />
    );
};

export default PrivateRoute;
