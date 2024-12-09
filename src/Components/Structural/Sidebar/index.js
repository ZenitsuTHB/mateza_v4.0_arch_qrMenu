// Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { useNavigate, useLocation } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig.js';
import { FaChevronRight, FaChevronLeft, FaThumbtack } from 'react-icons/fa';
import './css/sidebar.css';
import './css/mobile.css';

const Sidebar = () => {
  const isIframe = typeof window !== 'undefined' && window.isIframe;
  
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 900);
  const [isPinned, setIsPinned] = useState(false);
  const [collapseTimeout, setCollapseTimeout] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  const handleItemClick = (path) => {
    setActiveTab(path);
    navigate(path);
    if (isExpanded && !isPinned) {
      setIsExpanded(false);
    }
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
    if (isExpanded && isPinned) {
      setIsPinned(false);
    }
  };

  const togglePin = () => {
    setIsPinned((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (collapseTimeout) {
      clearTimeout(collapseTimeout);
      setCollapseTimeout(null);
    }
  };

  const handleMouseLeave = () => {
    if (isExpanded && !isPinned) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setCollapseTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (collapseTimeout) {
        clearTimeout(collapseTimeout);
      }
    };
  }, [collapseTimeout]);

  useEffect(() => {
    const adjustPadding = () => {
      const elements = document.querySelectorAll('.withHeader');
      elements.forEach((el) => {
        if (isPinned) {
          el.style.paddingLeft = '200px';
        } else {
          el.style.paddingLeft = isExpanded ? '200px' : '60px';
        }
      });
    };

    const timeoutId = setTimeout(adjustPadding, 0);

    return () => {
      clearTimeout(timeoutId);
      const elements = document.querySelectorAll('.withHeader');
      elements.forEach((el) => {
        el.style.paddingLeft = '';
      });
    };
  }, [isExpanded, isPinned, activeTab, location.pathname]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const mobile = window.innerWidth < 900;
      if (mobile) {
        setIsExpanded(false);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isPinned]);

    // If isIframe is true, do not render sidebar
    if (isIframe) {
      return null;
    }  

  return (
    <motion.div
      className={`sidebar-component ${isExpanded ? 'expanded' : ''}`}
      layout
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {routesConfig
        .filter((route) => route.isMenu)
        .map((route) => (
          <SidebarItem
            key={route.path}
            item={{ id: route.path, title: route.label, icon: route.icon }}
            activeTab={activeTab}
            handleItemClick={handleItemClick}
            isExpanded={isExpanded}
            isPinned={isPinned}
            secondaryTopBar={route.secondaryTopBar}
          />
        ))}
      <div className="sidebar-controls">
        <div className="sidebar-toggle-group">
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="sidebar-pin"
                onClick={togglePin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaThumbtack color={isPinned ? 'var(--color-accent)' : 'inherit'} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
