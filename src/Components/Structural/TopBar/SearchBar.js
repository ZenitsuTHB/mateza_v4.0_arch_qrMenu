import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './css/searchBar.css';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || "Zoeken"}
        aria-label="Zoeken"
        value={value || ''}
        onChange={onChange || (() => {})}
      />
    </div>
  );
};

export default SearchBar;
