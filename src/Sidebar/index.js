import React, { useState } from 'react';
import './style.css';
import NavButton from '../Components/Sidebar/NavButton';
import routesConfig from '../Routing/config.js';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleExpand = (index) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index],
    }));
  };

  const renderNavItems = (items, isSidebarOpen, parentPath = '') => {
    return items.map((item, index) => {
      const fullPath = `${parentPath}${item.path}`.replace(/\/+/g, '/');
      const isExpanded = expandedItems[fullPath];

      return (
        <div key={index} className="nav-item">
          <div className="nav-button-wrapper">
            <NavButton to={fullPath} icon={item.icon} label={item.label} />
            {item.children && (
              <button onClick={() => toggleExpand(fullPath)} className="expand-button">
                {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            )}
          </div>
          {item.children && isExpanded && isSidebarOpen && (
            <div className="nav-sub-items">
              {renderNavItems(item.children, isSidebarOpen, `${fullPath}/`)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        {isSidebarOpen ? 'Collapse' : 'Expand'}
      </button>
      {renderNavItems(routesConfig, isSidebarOpen)}
    </div>
  );
}

export default Sidebar;
