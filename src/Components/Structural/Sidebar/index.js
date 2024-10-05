// Components/Sidebar/Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem.js';
import { useNavigate } from 'react-router-dom';
import './css/style.css';
import routesConfig from '../../../config.js';

// Import all avatars manually
import blue1 from '../../../Assets/avatars/blue1.png';
import blue2 from '../../../Assets/avatars/blue2.png';
import blue3 from '../../../Assets/avatars/blue3.png';
import red1 from '../../../Assets/avatars/red1.png';
import red2 from '../../../Assets/avatars/red2.png';
import red3 from '../../../Assets/avatars/red3.png';
import green1 from '../../../Assets/avatars/green1.png';
import green2 from '../../../Assets/avatars/green2.png';
import green3 from '../../../Assets/avatars/green3.png';

// Avatar map that links filenames to actual imports
const avatarMapping = {
  'blue1': blue1,
  'blue2': blue2,
  'blue3': blue3,
  'red1': red1,
  'red2': red2,
  'red3': red3,
  'green1': green1,
  'green2': green2,
  'green3': green3,
};

// Default avatar as fallback if none is selected
const defaultAvatar = blue1;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [innerClass, setInnerClass] = useState('sidebar-initial');
  const [profileImage, setProfileImage] = useState(defaultAvatar); // Set initial avatar to default
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    setInnerClass('sidebar-inner');
    
    // Retrieve the selected avatar filename from localStorage
    const selectedAvatar = localStorage.getItem('selectedAvatar');
    
    // If there's a selected avatar and it's in the avatarMapping, set the corresponding image
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      setProfileImage(avatarMapping[selectedAvatar]);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Adjust the path to your profile route
  };

  return (
    <motion.div className="sidebar" layout>
      {/* Second motion.div with dynamic className */}
      <motion.div className={innerClass} layout>
        {routesConfig
          .filter((route) => route.isMenu && (isMobile ? route.isMobile : true))
          .map((route) => (
            <SidebarItem
              key={route.path}
              item={{ id: route.path, title: route.label, icon: route.icon }}
              activeTab={activeTab}
              setActiveTab={() => handleNavigation(route.path)}
            />
          ))}
      </motion.div>

      {/* Profile Section */}
      <motion.div
        className="sidebar-profile"
        onClick={handleProfileClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        tabIndex="0"
        role="button"
        aria-label="Profile"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleProfileClick();
          }
        }}
      >
        <span className="sidebar-item__icon">
          {/* Set the profile image src dynamically */}
          <img
            src={profileImage}
            alt="Profile"
            className="profile-pic"
          />
          <span className="tooltip">Profile</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
