import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaUser, FaBars, FaTimes, FaTachometerAlt, FaShoppingCart, FaSeedling, FaWarehouse } from 'react-icons/fa';
import { Button, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <Button onClick={toggleSidebar} className="sidebar-toggle">
        {collapsed ? <FaBars /> : <FaTimes />}
      </Button>
      <Nav className="bar-column">
        <Nav.Link as={NavLink} to="/browse">
          <FaShoppingCart />
          <span className="nav-text">{!collapsed && ' Browse Products'}</span>
        </Nav.Link>
        {isAuthenticated && (
          <>
            <Nav.Link as={NavLink} to="/dashboard">
              <FaTachometerAlt />
              <span className="nav-text">{!collapsed && ' Dashboard'}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-crops">
              <FaSeedling />
              <span className="nav-text">{!collapsed && ' My Crops'}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products/my-products">
              <FaWarehouse />
              <span className="nav-text">{!collapsed && ' Rentals'}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/crop-market">
              <FaShoppingCart />
              <span className="nav-text">{!collapsed && ' Crop Market'}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              <FaUser />
              <span className="nav-text">{!collapsed && ' My Profile'}</span>
            </Nav.Link>
          </>
        )}
        <Nav.Link as={NavLink} to="/about">
          <FaInfoCircle />
          <span className="nav-text">{!collapsed && ' About'}</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
