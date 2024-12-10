import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({
  item,
  activeTab,
  handleItemClick,
  isExpanded,
  activeColor
}) => {
  const [tooltipDisabled, setTooltipDisabled] = useState(false);
  const IconComponent = item.icon;

  // Wrapper function to handle item clicks and disable tooltip if necessary
  const handleItemClickWrapper = (id) => {
    handleItemClick(id);
    if (isExpanded) {
      setTooltipDisabled(true); // Disable tooltip after clicking when sidebar is expanded
    }
  };

  // Determine if the main item is active
  const isActive = activeTab === item.id;

  return (
    <motion.div
      className="sidebar-item-container"
      layout
    >
      <motion.div
        layout
        className={clsx('sidebar-item', {
          'sidebar-item__active': isActive,
        })}
        onClick={() => handleItemClickWrapper(item.id)}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-item-indicator"
            className="sidebar-item__active-bg"
          />
        )}
        <div className="sidebar-item__content">
          <span 
            className="sidebar-item__icon" 
            style={isActive ? { color: activeColor } : {}}
          >
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
          {!isExpanded && !tooltipDisabled && (
            <span className="tooltip">{item.title}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SidebarItem;
