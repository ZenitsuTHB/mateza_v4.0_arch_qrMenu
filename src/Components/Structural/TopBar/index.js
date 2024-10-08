// TopBar.js
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaChartLine, FaUser, FaLock } from 'react-icons/fa';
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu';
import './css/topBar.css';

const TopBar = () => {
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  const profileImage = useSelector(
    (state) => state.avatar.avatarImage || 'https://static.reservaties.net/images/logo/logo.png'
  );

  const handleMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAppsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAppsMenuOpen(false);
    }, 300); // 1 second delay
  };

  return (
    <div className="top-bar">
      {/* Left Section */}
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
        {/* Show Apps Menu */}
        {isAppsMenuOpen && (
          <AppsMenu
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </div>

      {/* Middle Section */}
      <div className="top-bar-middle">
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className="top-bar-right">
        <button className="icon-button" aria-label="Add">
          <FaPlus />
        </button>
        <button className="icon-button" aria-label="Analytics">
          <FaChartLine />
        </button>
        <button className="icon-button" aria-label="Lock">
          <FaLock />
        </button>
        <button className="icon-button" aria-label="Account">
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
