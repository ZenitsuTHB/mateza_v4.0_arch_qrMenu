import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({
  item,
  activeTab,
  handleItemClick,
  isExpanded,
  isPinned,
  secondaryTopBar,
  activeColor
}) => {
  const [showSecondaryItems, setShowSecondaryItems] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [tooltipDisabled, setTooltipDisabled] = useState(false);
  const IconComponent = item.icon;

  const handleMouseEnter = () => {
    if (secondaryTopBar && isExpanded && !isPinned) {
      const timeout = setTimeout(() => {
        setShowSecondaryItems(true);
      }, 500); // Show after 0.5 seconds
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (!isPinned) {
      setShowSecondaryItems(false);
    }
    setTooltipDisabled(false); // Reset tooltipDisabled on mouse leave
  };

  useEffect(() => {
    // Clean up the timeout when component unmounts
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Update showSecondaryItems based on isPinned
  useEffect(() => {
    if (isPinned) setShowSecondaryItems(true);
    else setShowSecondaryItems(false);
  }, [isPinned]);

  // Variants for the secondary items container
  const containerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { when: 'afterChildren' },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { when: 'afterChildren' },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -10,
    },
  };

  // Wrapper function to handle item clicks and disable tooltip if necessary
  const handleItemClickWrapper = (id) => {
    handleItemClick(id);
    if (isExpanded && !isPinned) {
      setTooltipDisabled(true); // Disable tooltip after clicking when sidebar is expanded
    }
  };

  // Determine if the main item is active
  const isActive =
    activeTab === item.id ||
    (secondaryTopBar && secondaryTopBar.some((subItem) => subItem.path === activeTab));

  return (
    <motion.div
      className="sidebar-item-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      {/* Secondary Items with Animation */}
      <AnimatePresence>
        {secondaryTopBar && showSecondaryItems && isExpanded && (
          <motion.div
            className="sidebar-item__secondary"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            layout
          >
            {secondaryTopBar.map((subItem) => (
              <motion.div
                key={subItem.path}
                className={clsx('sidebar-item__secondary-item', {
                  'sidebar-item__secondary-item--active': activeTab === subItem.path,
                })}
                onClick={() => handleItemClickWrapper(subItem.path)}
                variants={itemVariants}
                transition={{ duration: 0.2 }}
              >
                {subItem.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SidebarItem;
