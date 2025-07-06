import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <nav className="sidebar">
    <h2>Menu</h2>
    <NavLink to="/" end>Order Intake</NavLink>
    <NavLink to="/excel-sync">Excel Sync</NavLink>
    <NavLink to="/categorization">By Funeral</NavLink>
    <NavLink to="/generate-excel">Generate Excel</NavLink>
  </nav>
);

export default Sidebar;
