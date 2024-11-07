import React from 'react';
import './css/sidebar.css';
import Table from './Table'; // Adjust the import path as necessary

const Sidebar = ({ tables }) => {
  return (
    <div className="sidebar">
      <h2>Tables</h2>
      <div className="tables-list">
        {tables.map((table) => (
          <div key={table.id} className="table-item">
            <Table numberOfGuests={table.numberOfGuests} />
            <div className="table-info">
              <p>Table {table.id}</p>
              <p>Guests: {table.numberOfGuests}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
