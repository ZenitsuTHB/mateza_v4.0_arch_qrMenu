// Components/Sidebar/Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem.js';
import { useNavigate } from 'react-router-dom';
import './css/style.css';
import routesConfig from '../../../config.js';
import profilePic from '../../../Assets/avatars/blue1.png'; // Import your profile picture

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [innerClass, setInnerClass] = useState('sidebar-initial'); // State for dynamic class name
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
      setInnerClass('sidebar-inner'); // Change class after 0.2 seconds

  }, []);

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
        className="sidebar-profile" // Add a class for styling
        onClick={handleProfileClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="sidebar-item__icon">
          <img src={profilePic} alt="Profile" className="profile-pic" />
          <span className="tooltip">Profile</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
