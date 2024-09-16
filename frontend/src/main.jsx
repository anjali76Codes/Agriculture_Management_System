// src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n.js'; // Ensure you import the i18n configuration
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create the root and render the application
createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
