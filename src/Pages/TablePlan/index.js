// index.js
import React, { useState } from 'react';
import FloorPlan from './FloorPlan.js';
import Sidebar from './Sidebar.js';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './css/app.css';

const TablePlan = () => {
  // Dummy Reservations Data
  const [reservations, setReservations] = useState([
    { id: 1, firstName: 'Jan', lastName: 'De Vries', numberOfGuests: 4, time: '18:30', tableId: null },
    { id: 2, firstName: 'Marie', lastName: 'Jansen', numberOfGuests: 2, time: '19:00', tableId: null },
    { id: 3, firstName: 'Pieter', lastName: 'Bakker', numberOfGuests: 5, time: '20:15', tableId: null },
    { id: 4, firstName: 'Sophie', lastName: 'Visser', numberOfGuests: 3, time: '18:45', tableId: null },
    { id: 5, firstName: 'Lars', lastName: 'Smit', numberOfGuests: 6, time: '19:30', tableId: null },
    { id: 6, firstName: 'Emma', lastName: 'Meijer', numberOfGuests: 2, time: '20:00', tableId: null },
    { id: 7, firstName: 'Tom', lastName: 'Kuiper', numberOfGuests: 4, time: '18:15', tableId: null },
    { id: 8, firstName: 'Lisa', lastName: 'de Boer', numberOfGuests: 1, time: '19:45', tableId: null },
    { id: 9, firstName: 'Kees', lastName: 'Vos', numberOfGuests: 3, time: '20:30', tableId: null },
    { id: 10, firstName: 'Nina', lastName: 'Dijkstra', numberOfGuests: 5, time: '18:00', tableId: null },
  ]);

  // Dummy Tables Data with positions and capacities
  const [tables, setTables] = useState([
    { id: 1, capacity: 4, x: 100, y: 100 },
    { id: 2, capacity: 2, x: 300, y: 100 },
    { id: 3, capacity: 6, x: 500, y: 100 },
    { id: 4, capacity: 3, x: 100, y: 300 },
    { id: 5, capacity: 5, x: 300, y: 300 },
    { id: 6, capacity: 2, x: 500, y: 300 },
    { id: 7, capacity: 4, x: 100, y: 500 },
    { id: 8, capacity: 3, x: 300, y: 500 },
    { id: 9, capacity: 5, x: 500, y: 500 },
  ]);

  // Function to assign a reservation to a table, with swapping if necessary
// Function to assign a reservation to a table, with swapping if necessary
const assignReservation = (reservationId, targetTableId) => {
  setReservations((prevReservations) => {
    const targetTable = tables.find((t) => t.id === targetTableId);
    if (!targetTable) return prevReservations;

    const targetReservations = prevReservations.filter((res) => res.tableId === targetTableId);
    const totalGuests = targetReservations.reduce((acc, res) => acc + res.numberOfGuests, 0);

    const reservationToAssign = prevReservations.find((res) => res.id === reservationId);
    if (!reservationToAssign) return prevReservations;

    // Check if adding the reservation exceeds capacity
    if (totalGuests + reservationToAssign.numberOfGuests <= targetTable.capacity) {
      // Assign directly
      return prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: targetTableId } : res
      );
    } else {
      // Find a reservation to swap
      const possibleSwap = targetReservations.find(
        (res) => res.numberOfGuests === reservationToAssign.numberOfGuests
      );

      if (possibleSwap) {
        // Perform swap
        return prevReservations.map((res) => {
          if (res.id === reservationId) {
            return { ...res, tableId: targetTableId };
          }
          if (res.id === possibleSwap.id) {
            return { ...res, tableId: prevReservations.find((r) => r.id === reservationId).tableId };
          }
          return res;
        });
      }

      // If no suitable swap found, do not assign
      alert('Cannot assign reservation to this table. Not enough space and no suitable swap found.');
      return prevReservations;
    }
  });
};


  // Function to remove a reservation from a table
  const removeReservation = (reservationId) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: null } : res
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-display-component">
        <div className="app-container">
          <FloorPlan
            tables={tables}
            reservations={reservations}
            assignReservation={assignReservation}
            removeReservation={removeReservation}
          />
          <Sidebar reservations={reservations} />
        </div>
      </div>
    </DndProvider>
  );
};

export default withHeader(TablePlan);
