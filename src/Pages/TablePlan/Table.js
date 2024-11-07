// Table.js
import React from 'react';
import './css/table.css';

const Table = ({ numberOfGuests }) => {
  const isSquare = numberOfGuests === 4;

  const tableWidth = isSquare ? 70 : 70 + (numberOfGuests - 4) * 15;
  const tableHeight = 70;

  const chairsPerSide = Math.ceil(numberOfGuests / 2);

  const topChairs = [];
  const bottomChairs = [];

  for (let i = 0; i < chairsPerSide; i++) {
    topChairs.push(i);
    bottomChairs.push(i);
  }

  return (
    <div
      className="table-plan-component table-container"
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }}
    >
      <div
        className="table-plan-component chairs top-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.slice(0, Math.floor(numberOfGuests / 2)).map((chair, index) => (
          <div key={`top-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
      <div
        className="table-plan-component table"
        style={{
          width: `${tableWidth}px`,
          height: `${tableHeight}px`,
        }}
      ></div>
      <div
        className="table-plan-component chairs bottom-chairs"
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.slice(0, Math.ceil(numberOfGuests / 2)).map((chair, index) => (
          <div key={`bottom-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
    </div>
  );
};

export default Table;
