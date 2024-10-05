// Components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './sidebar-item.js';
import { useNavigate } from 'react-router-dom';
import './css/style.css';
import routesConfig from '../../config.js';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <motion.div className="sidebar" layout>
      {routesConfig.map((route) => (
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
