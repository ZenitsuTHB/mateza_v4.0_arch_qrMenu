// index.js
import React, { useState, useEffect } from 'react';
import FloorPlanGeneral from './FloorPlan.js';
import Sidebar from './Sidebar.js';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useReservations from './Hooks/useReservations.js';
import './css/app.css';

const TablePlan = () => {
  const fetchedReservations = useReservations();

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (fetchedReservations.length > 0 && reservations.length === 0) {
      setReservations(fetchedReservations);
    }
  }, [fetchedReservations, reservations]);

  // Function to assign a reservation to a table
  const assignReservation = (reservationId, targetTableId) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: targetTableId } : res
      )
    );
  };

  // Function to remove a reservation from a table
  const removeReservation = (reservationId) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, tableId: null } : res
      )
    );
  };

  // Function to update notes for a reservation
  const updateNotes = (reservationId, newNotes) => {
    setReservations((prevReservations) =>
      prevReservations.map((res) =>
        res.id === reservationId ? { ...res, notes: newNotes } : res
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-display-component">
        <div className="app-container">
          <FloorPlanGeneral
            reservations={reservations}
            assignReservation={assignReservation}
            removeReservation={removeReservation}
            updateNotes={updateNotes}
          />
          <Sidebar reservations={reservations} />
        </div>
      </div>
    </DndProvider>
  );
};

export default withHeader(TablePlan);
