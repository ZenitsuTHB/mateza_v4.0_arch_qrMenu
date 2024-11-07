// src/components/Sidebar.jsx

import React, { useState } from 'react';
import './css/sidebar.css';
import Table from './Table.js';
import Walls from './Walls.js';

const Sidebar = ({ tables, walls }) => {
  const [activeTab, setActiveTab] = useState('tables');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tables and walls based on search term
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

  return (
    <div className="sidebar">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('tables');
            setSearchTerm('');
          }}
          aria-label="Tables Tab"
        >
          Tables
        </button>
        <button
          className={`tab-button ${activeTab === 'walls' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('walls');
            setSearchTerm('');
          }}
          aria-label="Walls Tab"
        >
          Walls
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label={`Search ${activeTab}`}
        />
      </div>

      {/* Items List */}
      <div className="items-list">
        {activeTab === 'tables' && filteredTables.length > 0 ? (
          <div className="grid-container">
            {filteredTables.map((table) => (
              <div key={table.id} className="item">
                <Table numberOfGuests={table.numberOfGuests} />
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
                <Walls length={wall.length} />
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
