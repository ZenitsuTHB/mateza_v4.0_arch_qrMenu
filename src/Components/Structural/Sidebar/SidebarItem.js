// SidebarItem.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import clsx from 'clsx';

const SidebarItem = ({ item, activeTab, setActiveTab, isExpanded }) => {
  const IconComponent = item.icon;

  return (
    <motion.div
      layout
      className={clsx('sidebar-item', {
        'sidebar-item__active': activeTab === item.id,
      })}
      onClick={setActiveTab}
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
        {!isExpanded && (
          <span className="tooltip">{item.title}</span>
        )}
      </div>
    </motion.div>
  );
};

export default SidebarItem;
