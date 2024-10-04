import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuHome, LuMail, LuFolderClosed, LuStickyNote, LuBell, LuChevronRight, LuChevronLeft } from "react-icons/lu";
import SidebarItem from "./sidebar-item.js";
import './style.css';

const SIDEBAR_ITEMS = [
  { id: "dashboard", title: "Dashboard", icon: LuHome },
  { id: "mail", title: "Mail", icon: LuMail },
  { id: "projects", title: "Projects", icon: LuFolderClosed },
  { id: "reports", title: "Reports", icon: LuStickyNote },
  { id: "notifications", title: "Notifications", icon: LuBell },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(SIDEBAR_ITEMS[0].id);

  return (
    <motion.div
      className="sidebar"
      animate={{ width: isCollapsed ? 80 : 280 }}
      layout
    >
      <h3>Logo</h3>
      <button
        className="sidebar__collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <LuChevronRight /> : <LuChevronLeft />}
      </button>
      {SIDEBAR_ITEMS.map((item) => (
        <SidebarItem
          isSidebarCollapsed={isCollapsed}
          key={item.id}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </motion.div>
  );
};

export default Sidebar;