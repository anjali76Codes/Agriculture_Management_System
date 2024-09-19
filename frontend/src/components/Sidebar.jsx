import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaShoppingCart, FaSeedling, FaWarehouse, FaUser, FaInfoCircle, FaHome } from 'react-icons/fa';
import { Button, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation for multilingual support
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAuth(); // Get authentication status
  const { t } = useTranslation(); // Initialize translation function

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <Button onClick={toggleSidebar} className="sidebar-toggle">
        {collapsed ? <FaBars /> : <FaTimes />}
      </Button>
      <Nav className="flex-column">
        {/* Home Link */}
        <Nav.Link as={NavLink} to="/">
          <FaHome />
          <span className="nav-text">{!collapsed && ` ${t('sidebar.home')}`}</span>
        </Nav.Link>
        
        {/* Browse Products Link */}
        <Nav.Link as={NavLink} to="/browse">
          <FaShoppingCart />
          <span className="nav-text">{!collapsed && ` ${t('sidebar.browseProducts')}`}</span>
        </Nav.Link>
        
        {/* Authenticated Routes */}
        {isAuthenticated && (
          <>
            <Nav.Link as={NavLink} to="/dashboard">
              <FaTachometerAlt />
              <span className="nav-text">{!collapsed && ` ${t('sidebar.dashboard')}`}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-crops">
              <FaSeedling />
              <span className="nav-text">{!collapsed && ` ${t('sidebar.myCrops')}`}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products/my-products">
              <FaWarehouse />
              <span className="nav-text">{!collapsed && ` ${t('sidebar.rentals')}`}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/crop-market">
              <FaShoppingCart />
              <span className="nav-text">{!collapsed && ` ${t('sidebar.cropMarket')}`}</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              <FaUser />
              <span className="nav-text">{!collapsed && ` ${t('sidebar.myProfile')}`}</span>
            </Nav.Link>
          </>
        )}

        {/* About Link */}
        <Nav.Link as={NavLink} to="/about">
          <FaInfoCircle />
          <span className="nav-text">{!collapsed && ` ${t('sidebar.about')}`}</span>
        </Nav.Link>
      </Nav>
    </div>
    </>
  );
};

export default Sidebar;
