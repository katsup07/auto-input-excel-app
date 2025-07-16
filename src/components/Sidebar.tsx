import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <nav className="sidebar">
    <h2 className="menu">メニュー</h2>
    <NavLink to="/" end>注文一覧</NavLink>
    <NavLink to="/categorization">注文の分類・集計</NavLink>
    <NavLink to="/csv-to-excel">CSVをExcelに追加</NavLink>
  </nav>
);

export default Sidebar;
