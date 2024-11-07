// Sidebar.js
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Table from './Table.js';
import Walls from './Walls.js';
import './css/sidebar.css';

const Sidebar = ({ tables, walls }) => {
  const [activeTab, setActiveTab] = useState('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingTab, setPendingTab] = useState(null);

  const tablesRef = useRef();
  const wallsRef = useRef();

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const tabs = [
    { id: 'tables', label: 'Tables', title: "Manage Tables" },
    { id: 'walls', label: 'Walls', title: "Manage Walls" },
  ];

  const filteredTables = tables.filter(
    (table) =>
      table.id.toString().includes(searchTerm) ||
      table.numberOfGuests.toString().includes(searchTerm)
  );

  const filteredWalls = walls.filter(
    (wall) =>
      wall.id.toString().includes(searchTerm) ||
      wall.length.toString().includes(searchTerm)
  );

  const handleTabClick = async (tabId, tabTitle) => {
    let currentRef;
    if (activeTab === 'tables') {
      currentRef = tablesRef;
    } else if (activeTab === 'walls') {
      currentRef = wallsRef;
    }

    if (currentRef && currentRef.current && currentRef.current.isDirty) {
      if (isIframe) {
        try {
          await currentRef.current.handleSave();
          setActiveTab(tabId);
        } catch (error) {
          console.error('Error saving before tab switch:', error);
        }
      } else {
        setPendingTab({ id: tabId, title: tabTitle });
      }
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="sidebar">
      <div className="tabs">
        <div className="buttons-container">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              type="button"
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id, tab.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline-sidebar-tabs"
                  className="tab-underline"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={`Search ${activeTab}`}
        />
      </div>
      <div className="items-list">
        {activeTab === 'tables' && filteredTables.length > 0 ? (
          <div className="grid-container">
            {filteredTables.map((table) => (
              <div key={table.id} className="item">
                <Table numberOfGuests={table.numberOfGuests} ref={tablesRef} />
                <div className="item-info">
                  <p>Table {table.id}</p>
                  <p>Guests: {table.numberOfGuests}</p>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'walls' && filteredWalls.length > 0 ? (
          <div className="grid-container">
            {filteredWalls.map((wall) => (
              <div key={wall.id} className="item">
                <Walls length={wall.length} ref={wallsRef} />
                <div className="item-info">
                  <p>Wall {wall.id}</p>
                  <p>Length: {wall.length} units</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No {activeTab} found.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
