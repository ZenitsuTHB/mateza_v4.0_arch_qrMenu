import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const SidebarItem = ({ item, activeTab, setActiveTab }) => {
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
      <span className="sidebar-item__icon">
        <IconComponent />
        <span className="tooltip">{item.title}</span>
      </span>
    </motion.div>
  );
};

export default SidebarItem;
