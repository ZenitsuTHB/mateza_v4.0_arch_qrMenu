import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const SidebarItem = ({ item, activeTab, setActiveTab, isSidebarCollapsed }) => {
  const IconComponent = item.icon;

  return (
    <motion.div
      layout
      className={clsx("sidebar-item", {
        "sidebar-item__active": activeTab === item.id,
      })}
      onFocus={() => setActiveTab(item.id)}
      onMouseOver={() => setActiveTab(item.id)}
      onMouseLeave={() => setActiveTab(item.id)}
    >
      {activeTab === item.id ? (
        <motion.div
          layoutId="sidebar-item-indicator"
          className="sidebar-item__active-bg"
        />
      ) : null}
      <span className="sidebar-item__icon">
        <IconComponent />
      </span>
      {activeTab === item.id && !isSidebarCollapsed ? (
        <motion.span
          className="sidebar-item__tooltip"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
        >
          {item.title}
        </motion.span>
      ) : null}
    </motion.div>
  );
};

export default SidebarItem;