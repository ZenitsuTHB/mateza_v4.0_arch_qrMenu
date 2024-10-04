import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function NavButton({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="nav-button__link">
      <Icon className="nav-button__icon" />
      <span className="nav-button__label">{label}</span>
    </Link>
  );
}

export default NavButton;