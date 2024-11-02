// SidebarItem.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({ item, activeTab, setActiveTab, isExpanded, secondaryTopBar }) => {
  const [showSecondaryItems, setShowSecondaryItems] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const IconComponent = item.icon;

  const handleMouseEnter = () => {
    if (secondaryTopBar) {
      const timeout = setTimeout(() => {
        setShowSecondaryItems(true);
      }, 2000); // Show after 2 seconds
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowSecondaryItems(false);
  };

  useEffect(() => {
    // Clean up the timeout when component unmounts
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <div
      className="sidebar-item-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        className={clsx('sidebar-item', {
          'sidebar-item__active': activeTab === item.id,
        })}
        onClick={() => setActiveTab(item.id)}
      >
        {activeTab === item.id && (
          <motion.div
            layoutId="sidebar-item-indicator"
            className="sidebar-item__active-bg"
          />
        )}
        <div className="sidebar-item__content">
          <span className="sidebar-item__icon">
            <IconComponent />
          </span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className="sidebar-item__text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
          {!isExpanded && <span className="tooltip">{item.title}</span>}
        </div>
      </motion.div>

      {/* Secondary Items */}
      {showSecondaryItems && (
        <div className="sidebar-item__secondary">
          {secondaryTopBar &&
            secondaryTopBar.map((subItem) => (
              <div
                key={subItem.path}
                className="sidebar-item__secondary-item"
                onClick={() => setActiveTab(subItem.path)}
              >
                {subItem.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
