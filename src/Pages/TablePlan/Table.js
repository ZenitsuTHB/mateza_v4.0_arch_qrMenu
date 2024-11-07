// src/components/Table.jsx

import React from 'react';
import './css/table.css';

const Table = ({ numberOfGuests }) => {
  // Determine if the table is square
  const isSquare = numberOfGuests === 4;

  // Calculate table dimensions
  const tableWidth = isSquare ? 70 : 70 + (numberOfGuests - 4) * 15; // Adjust width for more guests
  const tableHeight = 70;

  // Calculate number of chairs per side
  const chairsPerSide = Math.ceil(numberOfGuests / 2);

  // Generate arrays for top and bottom chairs
  const topChairs = [];
  const bottomChairs = [];

  for (let i = 0; i < chairsPerSide; i++) {
    topChairs.push(i);
    bottomChairs.push(i);
  }

  return (
    <div
      className="table-container"
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }} // Increased height to accommodate chairs
    >
      {/* Chairs - Top */}
      <div
        className="chairs top-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.slice(0, Math.floor(numberOfGuests / 2)).map((chair, index) => (
          <div key={`top-${index}`} className="chair"></div>
        ))}
      </div>

      {/* Table */}
      <div
        className="table"
        style={{
          width: `${tableWidth}px`,
          height: `${tableHeight}px`,
        }}
      ></div>

      {/* Chairs - Bottom */}
      <div
        className="chairs bottom-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.slice(0, Math.ceil(numberOfGuests / 2)).map((chair, index) => (
          <div key={`bottom-${index}`} className="chair"></div>
        ))}
      </div>
    </div>
  );
};

export default Table;
