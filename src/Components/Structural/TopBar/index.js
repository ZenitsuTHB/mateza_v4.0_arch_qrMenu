// TopBar.js
import React from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaChartLine, FaUser, FaLock } from 'react-icons/fa'; // Importing Font Awesome icons from react-icons
import SearchBar from './SearchBar';
import './css/topBar.css';

const TopBar = () => {
  // Select the profile image from Redux store
  const profileImage = useSelector((state) => state.avatar.avatarImage) || 'https://static.reservaties.net/images/logo/logo.png';

  return (
    <div className="top-bar">
      {/* Left Section */}
      <div className="top-bar-left">
        <h3 className="top-bar-title">Mateza Booking</h3>
        
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
        <button className="icon-button" aria-label="Lock">
          <FaUser />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
