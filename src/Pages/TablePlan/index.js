import React from 'react';
import FloorPlan from './FloorPlan.js';
import Sidebar from './Sidebar.js';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './css/app.css';

const TablePlan = () => {
  const tables = [
    { id: 1, numberOfGuests: 1 },
    { id: 2, numberOfGuests: 2 },
    { id: 3, numberOfGuests: 3 },
    { id: 4, numberOfGuests: 4 },
    { id: 5, numberOfGuests: 5 },
    { id: 6, numberOfGuests: 6 },
    { id: 1, numberOfGuests: 7 },
    { id: 2, numberOfGuests: 8 },
    { id: 3, numberOfGuests: 9 },
    { id: 4, numberOfGuests: 10 },
    { id: 5, numberOfGuests: 11 },
    { id: 6, numberOfGuests: 12 },
    { id: 1, numberOfGuests: 13 },
    { id: 2, numberOfGuests: 14 },
    { id: 3, numberOfGuests: 15 },
    { id: 4, numberOfGuests: 16 },
    { id: 5, numberOfGuests: 17 },
    { id: 6, numberOfGuests: 18 },
    { id: 5, numberOfGuests: 19 },
    { id: 6, numberOfGuests: 20 },
  ];

  const walls = [
    { id: 1, length: 3 },
    { id: 2, length: 5 },
    { id: 3, length: 2 },
    { id: 4, length: 4 },
    { id: 5, length: 6 },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-plan-component">
        <div className="app-container">
          <FloorPlan />
          <Sidebar tables={tables} walls={walls} />
        </div>
      </div>
    </DndProvider>
  );
};

export default withHeader(TablePlan);