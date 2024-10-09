// TopBar.js

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import topBarConfig from '../../../Config/topbarConfig.js'; // Adjust the path as needed
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu';
import './css/topBar.css';
import './css/mobile.css';
import './css/animations.css';
import logoImage from '../../../Assets/logos/6.webp'; // Adjust the path to your image

const TopBar = () => {
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAppsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAppsMenuOpen(false);
    }, 300);
  };

  return (
    <div className="top-bar-component">
      <div className="top-bar">
        <div
          className="top-bar-left"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`nine-dots-wrapper ${isAppsMenuOpen ? 'active' : ''}`}>
            <div className="nine-dots">
              {[...Array(9)].map((_, index) => (
                <span key={index} className={`dot dot-${index + 1}`}></span>
              ))}
            </div>
          </div>
          <h3 className="top-bar-title">Mateza Booking</h3>
          <img src={logoImage} alt="Logo" className="title-image" />
          {isAppsMenuOpen && (
            <AppsMenu
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </div>

        <div className="top-bar-middle">
          <SearchBar />
        </div>

        <div className="top-bar-right">
          {topBarConfig.map((button) => {
            const IconComponent = button.icon;
            return (
              <button
                key={button.label}
                className="icon-button"
                aria-label={button.label}
                onClick={() => navigate(button.path)}
              >
                <IconComponent />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
