// src/components/Sidebar.jsx

import React, { useState } from 'react';
import SearchBar from './SearchBar';
import DraggableComponentsList from './DraggableComponentsList';
import './css/sidebar.css';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="sidebar">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <DraggableComponentsList searchQuery={searchQuery} />
    </div>
  );
};

export default Sidebar;
