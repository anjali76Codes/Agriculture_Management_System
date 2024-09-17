// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
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
import Navbar from "./components/Navbar";
// import MyCrops from './pages/MyCrops';  // Import MyCrops component

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ProductBrowse />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/browse" element={<ProductBrowse />} />
            <Route path="/products/my-products" element={<MyProducts />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;