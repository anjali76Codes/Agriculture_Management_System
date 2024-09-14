// Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Button, Nav } from 'react-bootstrap';
import '../styles/Sidebar.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <Button onClick={toggleSidebar} className="sidebar-toggle">
        {collapsed ? <FaBars /> : <FaTimes />}
      </Button>
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/" exact>
          <FaHome />
          {!collapsed && ' Home'}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/about">
          <FaInfoCircle />
          {!collapsed && ' About'}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/profile">
          <FaUser />
          {!collapsed && ' Profile'}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
