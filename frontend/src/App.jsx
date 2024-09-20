// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Profile from "./pages/Auth/Profile";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Dashboard from "./pages/Dashboard";
import ProductForm from './pages/Sell/ProductForm';
import ProductBrowse from './pages/Sell/ProductBrowse';
import MyProducts from './pages/Sell/MyProducts';
import ProductDetail from './pages/Sell/ProductDetail';
import RentedProducts from "./pages/Sell/RentedProducts"; // Added RentedProducts
import PrivateRoute from "./components/PrivateRoute";
import MyCrops from './pages/MyCrops';  // Import MyCrops component
import Navbar from "./components/Navbar"; // Use custom Navbar component
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <Navbar /> {/* Show Navbar regardless of authentication */}

      <div className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<ProductBrowse />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/products/add" element={<PrivateRoute element={ProductForm} />} />
          <Route path="/products/edit/:id" element={<PrivateRoute element={ProductForm} />} /> {/* Added this line */}
          <Route path="/products/my-products" element={<PrivateRoute element={MyProducts} />} />
          <Route path="/products/:id" element={<PrivateRoute element={ProductDetail} />} />
          <Route path="/rented-products" element={<PrivateRoute element={RentedProducts} />} />
          <Route path="/my-crops" element={<PrivateRoute element={MyCrops} />} />

          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
