import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaUser, FaBars, FaTimes, FaTachometerAlt, FaShoppingCart, FaSeedling, FaWarehouse } from 'react-icons/fa'; // Add necessary icons
import { Button, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Import the AuthContext
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <Button onClick={toggleSidebar} className="sidebar-toggle">
        {collapsed ? <FaBars /> : <FaTimes />}
      </Button>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/browse">
          <FaShoppingCart />
          {!collapsed && ' Browse Products'}
        </Nav.Link>
        {isAuthenticated && (
          <>
            <Nav.Link as={NavLink} to="/dashboard">
              <FaTachometerAlt />
              {!collapsed && ' Dashboard'}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-crops">
              <FaSeedling />
              {!collapsed && ' My Crops'}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products/my-products">
              <FaWarehouse />
              {!collapsed && ' Rentals'}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/crop-market">
              <FaShoppingCart />
              {!collapsed && ' Crop Market'}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              <FaUser />
              {!collapsed && ' My Profile'}
            </Nav.Link>
          </>
        )}
        <Nav.Link as={NavLink} to="/about">
          <FaInfoCircle />
          {!collapsed && ' About'}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
