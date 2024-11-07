import React from 'react';
import Table from './Table';
import './css/parentComponent.css';

const ParentComponent = () => {
  const sampleTables = [2, 4, 6, 8];

  return (
    <div className="parent-container">
      {sampleTables.map((guests, index) => (
        <div key={index} className="table-wrapper">
          <Table numberOfGuests={guests} />
          <div className="guest-count">{guests} Guests</div>
        </div>
      ))}
    </div>
  );
};

export default ParentComponent;
