// Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig.js';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'; // Import chevron icons
import './css/style.css';
import './css/mobile.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [isExpanded, setIsExpanded] = useState(false); // State for sidebar expansion
  const [collapseTimeout, setCollapseTimeout] = useState(null); // For auto-collapse
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    // Clear any existing collapse timeout when manually toggling
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseEnter = () => {
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    if (isExpanded) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // Collapse after 5 seconds
      setCollapseTimeout(timeout);
    }
  };

  useEffect(() => {
    // Clean up the timeout when component unmounts
    return () => {
      if (collapseTimeout) {
        clearTimeout(collapseTimeout);
      }
    };
  }, [collapseTimeout]);

  return (
    <motion.div
      className={`sidebar-component ${isExpanded ? 'expanded' : ''}`}
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {routesConfig
        .filter((route) => route.isMenu && (isMobile ? route.isMobile : true))
        .map((route) => (
          <SidebarItem
            key={route.path}
            item={{ id: route.path, title: route.label, icon: route.icon }}
            activeTab={activeTab}
            setActiveTab={() => handleNavigation(route.path)}
            isExpanded={isExpanded && !isMobile} // Expanded only on non-mobile devices
          />
        ))}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
      </div>
    </motion.div>
  );
};

export default Sidebar;
