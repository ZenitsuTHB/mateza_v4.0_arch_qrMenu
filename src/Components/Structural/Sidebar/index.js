// Sidebar.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem.js';
import { useNavigate } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig.js';
import './css/style.css';
import './css/mobile.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 900;

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
        <motion.div className="sidebar-component" layout>
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
  );
};

export default Sidebar;
