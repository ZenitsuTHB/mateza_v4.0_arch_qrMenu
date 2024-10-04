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
		<motion.span
		  className="sidebar-item__title"
		  animate={{
			clipPath: isSidebarCollapsed
			  ? "inset(0% 100% 0% 0%)"
			  : "inset(0% 0% 0% 0%)",
			opacity: isSidebarCollapsed ? 0 : 1,
		  }}
		>
		  {item.title}
		</motion.span>
	  </motion.div>
	);
  };

  export default SidebarItem;