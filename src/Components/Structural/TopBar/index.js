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
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks which dropdown is open
  const menuTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  // Handlers for Apps Menu (Left Side)
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

  // Handlers for Account, Add, and Edit Dropdowns (Right Side)
  const handleDropdownMouseEnter = (label) => {
    clearTimeout(menuTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.setItem('loginSuccessful', false);
    window.location.reload();
  };

  // Define animation variants for the dropdown menus
  const dropdownMenuVariants = {
    hidden: { opacity: 0, y: '-10px' },
    visible: { opacity: 1, y: '0' },
    exit: { opacity: 0, y: '-10px' },
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
          {isAppsMenuOpen && (
            <AppsMenu
              onMouseEnter={handleAppsMouseEnter}
              onMouseLeave={handleAppsMouseLeave}
            />
          )}
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

        {/* Right Side */}
        <div className="top-bar-right">
          {topBarConfig.map((button) => {
            const IconComponent = button.icon;
            if (button.hasDropdown) {
              return (
                <div
                  key={button.label}
                  className="dropdown-button-wrapper"
                  onMouseEnter={() => handleDropdownMouseEnter(button.label)}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <button
                    className="icon-button"
                    aria-label={button.label}
                    onClick={() => navigate(button.path)}
                    style={{ color: button.iconColor || 'var(--color-accent)' }}
                  >
                    <IconComponent />
                  </button>
                  <AnimatePresence>
                    {openDropdown === button.label && (
                      <motion.div
                        className="dropdown-menu"
                        variants={dropdownMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                      >
                        {button.dropdownItems.map((item, index) => (
                          <button
                            key={index}
                            className="dropdown-button"
                            onClick={() => {
                              if (item.action === 'logout') {
                                handleLogout();
                              } else if (item.path) {
                                navigate(item.path);
                              }
                            }}
                          >
                            <item.icon
                              className={`dropdown-icon ${item.isLogout ? 'logout' : ''}`}
                              style={{ color: item.iconColor || 'black' }}
                            />
                            <span className="dropdown-text">{item.label}</span>
                          </button>
                        ))}
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
