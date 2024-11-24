// TopBar.jsx

import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import topBarConfig from '../../../Config/topbarConfig.js';
import SearchBar from './SearchBar';
import AppsMenu from './AppsMenu';
import { SearchContext } from '../../../Context/SearchContext.js';
import './css/topBar.css';
import './css/mobile.css';
import './css/animations.css';
import logoImage from '../../../Assets/logos/logo.webp';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the shutdown icon
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion components

const TopBar = () => {
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // State for Account Menu
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const handleMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAppsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAppsMenuOpen(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handlers for Account Menu
  const handleAccountMouseEnter = () => {
    clearTimeout(menuTimeoutRef.current);
    setIsAccountMenuOpen(true);
  };

  const handleAccountMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsAccountMenuOpen(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.setItem('loginSuccessful', false);
    window.location.reload();
  };

  // Define animation variants for the account menu
  const accountMenuVariants = {
    hidden: { opacity: 0, y: '-10px' },
    visible: { opacity: 1, y: '0' },
    exit: { opacity: 0, y: '-10px' },
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

        <div className="top-bar-right">
          {topBarConfig.map((button) => {
            const IconComponent = button.icon;
            if (button.hasDropdown === true) {
              return (
                <div
                  key={button.label}
                  className="account-button-wrapper"
                  onMouseEnter={handleAccountMouseEnter}
                  onMouseLeave={handleAccountMouseLeave}
                >
                  <button
                    className="icon-button"
                    aria-label={button.label}
                    onClick={() => navigate(button.path)}
                  >
                    <IconComponent />
                  </button>
                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        className="account-menu"
                        variants={accountMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                      >
                        <button className="logout-button" onClick={handleLogout}>
                          <FaSignOutAlt className="logout-icon" />
                          <span className="logout-text">Uitloggen</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            } else {
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
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
