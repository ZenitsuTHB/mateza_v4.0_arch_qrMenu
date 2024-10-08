// TopBar.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaChartLine, FaUser, FaLock } from 'react-icons/fa'; // Importing Font Awesome icons from react-icons
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu'; // Import the AppsMenu
import './css/topBar.css';

const TopBar = () => {
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);

  const profileImage = useSelector(
    (state) => state.avatar.avatarImage || 'https://static.reservaties.net/images/logo/logo.png'
  );

  return (
    <div className="top-bar">
      {/* Left Section */}
      <div
        className={`top-bar-left ${isAppsMenuOpen ? 'active' : ''}`} // Toggle background color when hovering
        onMouseEnter={() => setIsAppsMenuOpen(true)}
        onMouseLeave={() => setIsAppsMenuOpen(false)}
      >
        <div className="nine-dots">
          {[...Array(9)].map((_, index) => (
            <span key={index} className={`dot dot-${index + 1}`}></span>
          ))}
        </div>
        <h3 className="top-bar-title">Mateza Booking</h3>
        {/* Show Apps Menu on hover */}
        {isAppsMenuOpen && <AppsMenu onClose={() => setIsAppsMenuOpen(false)} />}
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
