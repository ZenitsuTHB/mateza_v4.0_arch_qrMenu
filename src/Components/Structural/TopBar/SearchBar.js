// SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importing the search icon
import './css/searchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Zoeken"
        aria-label="Zoeken"
      />
    </div>
  );
};

export default SearchBar;
