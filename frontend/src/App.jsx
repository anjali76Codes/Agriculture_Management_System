// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Profile from './pages/Auth/Profile';
import SignUp from './pages/Auth/SignUp';
import SignIn from './pages/Auth/SignIn';
import ProductForm from './pages/Sell/ProductForm';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<LandingPage />} />

            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/productsell" element={<ProductForm />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
