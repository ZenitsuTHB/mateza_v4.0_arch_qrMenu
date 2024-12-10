// TopBar.jsx

import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu';
import { SearchContext } from '../../../Context/SearchContext.js';
import './css/topBar.css';
import './css/mobile.css';
import './css/animations.css';
import logoImage from '../../../Assets/logos/logo.webp';
import { FaUser, FaChevronDown } from 'react-icons/fa';

const TopBar = () => {
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  // Handlers for Apps Menu (Left Side) - can be removed if not needed
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  const handleAppsMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAppsMenuOpen(true);
  };

  const handleAppsMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAppsMenuOpen(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="top-bar-component">
      <div className="top-bar">
        {/* Left Side */}
        <div
          className="top-bar-left"
          onMouseEnter={handleAppsMouseEnter}
          onMouseLeave={handleAppsMouseLeave}
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
          {/*
          {isAppsMenuOpen && (
            <AppsMenu
              onMouseEnter={handleAppsMouseEnter}
              onMouseLeave={handleAppsMouseLeave}
            />
          )}
          */}
        </div>

        {/* Middle Side */}
        <div className="top-bar-middle">
          {location.pathname === '/day-list' ? (
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Zoeken"
            />
          ) : (
            <SearchBar />
          )}
        </div>

        {/* Right Side: White box with icon, name "Thibault", and chevron */}
        <div className="top-bar-right">
          <div className="user-box">
            <FaUser className="user-icon" />
            <span className="user-name">Thibault</span>
            <FaChevronDown className="user-chevron" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
