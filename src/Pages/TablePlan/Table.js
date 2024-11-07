// src/components/Table.jsx

import React from 'react';
import './css/table.css';

const Table = ({ subtype }) => {
  return (
    <div className={`table ${subtype}`}>
      {/* Optional: Display table capacity or number */}
    </div>
  );
};

export default Table;
