import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaTachometerAlt, FaShoppingCart, FaSeedling, FaWarehouse, FaUser, FaInfoCircle } from 'react-icons/fa';
import { Button, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAuth(); // Get authentication status from context
  const { t } = useTranslation(); // Initialize useTranslation

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
          {!collapsed && ` ${t('sidebar.browseProducts')}`}
        </Nav.Link>
        {isAuthenticated && (
          <>
            <Nav.Link as={NavLink} to="/dashboard">
              <FaTachometerAlt />
              {!collapsed && ` ${t('sidebar.dashboard')}`}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-crops">
              <FaSeedling />
              {!collapsed && ` ${t('sidebar.myCrops')}`}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products/my-products">
              <FaWarehouse />
              {!collapsed && ` ${t('sidebar.rentals')}`}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/crop-market">
              <FaShoppingCart />
              {!collapsed && ` ${t('sidebar.cropMarket')}`}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              <FaUser />
              {!collapsed && ` ${t('sidebar.myProfile')}`}
            </Nav.Link>
          </>
        )}
        <Nav.Link as={NavLink} to="/about">
          <FaInfoCircle />
          {!collapsed && ` ${t('sidebar.about')}`}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
