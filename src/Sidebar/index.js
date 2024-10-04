
import React, { useState } from "react";
import { motion } from "framer-motion";
import SidebarItem from "./sidebar-item.js";
import { useNavigate } from 'react-router-dom';
import './style.css';
import routesConfig from '../Routing/config.js';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(routesConfig[0].label);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <motion.div
      className="sidebar"
      animate={{ width: 80 }}
      layout
    >
      {routesConfig.map((route) => (
        <SidebarItem
          isSidebarCollapsed={true}
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