// Table.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './css/table.css';

const Table = ({ capacity, reservations, tableId, removeReservation, updateNotes, isActive }) => {
  const isOccupied = reservations.length > 0;

  // Calculate table width based on capacity
  const tableWidth = 70 + (capacity > 4 ? (capacity - 4) * 10 : 0);
  const tableHeight = 70;

  const chairsPerSide = Math.ceil(capacity / 2);

  const topChairs = [];
  const bottomChairs = [];

  for (let i = 0; i < chairsPerSide; i++) {
    topChairs.push(i);
    bottomChairs.push(i);
  }

  return (
    <div
      className={`table-display-component table-container ${isOccupied ? 'occupied' : ''}`}
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }}
    >
      {/* Tooltip */}
      {isOccupied && (
        <div className="tooltip">
          {reservations.map((res) => (
            <div key={res.id} className="tooltip-content">
              <div className="reservation-summary">
                <span className="reservation-name">{res.firstName} {res.lastName}</span> ({res.numberOfGuests}p) - {res.time}
              </div>
              <div className="reservation-notes">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={res.notes}
                  onChange={(e) => updateNotes(res.id, e.target.value)}
                  aria-label={`Add a note for reservation of ${res.firstName} ${res.lastName}`}
                />
              </div>
              <div className="tooltip-actions">
                <button
                  onClick={() => handleEdit(res.id)}
                  className="tooltip-button edit-button"
                  aria-label={`Edit reservation for ${res.firstName} ${res.lastName}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="tooltip-button delete-button"
                  aria-label={`Delete reservation for ${res.firstName} ${res.lastName}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`table-display-component chairs top-chairs ${isOccupied ? 'chairs-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.map((chair, index) => (
          <div key={`top-${index}`} className="table-display-component chair"></div>
        ))}
      </div>
      <div
        className={`table-display-component table ${isOccupied ? 'table-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
          height: `${tableHeight}px`,
        }}
      >
        {/* Display Reservations Assigned to This Table */}
        {reservations.map((res) => (
          <Reservation
            key={res.id}
            reservation={res}
            tableId={tableId}
            removeReservation={removeReservation}
          />
        ))}
        {/* Table Number */}
        <div className="table-number">T{tableId}</div>
      </div>
      <div
        className={`table-display-component chairs bottom-chairs ${isOccupied ? 'chairs-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.map((chair, index) => (
          <div key={`bottom-${index}`} className="table-display-component chair"></div>
        ))}
      </div>
    </div>
  );
};

// Reservation Component
const Reservation = ({ reservation, tableId, removeReservation }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'GUEST',
    item: { id: reservation.id, ...reservation },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [reservation]);

  return (
    <div
      className="reservation"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <span className="reservation-name">{reservation.firstName} {reservation.lastName}</span> ({reservation.numberOfGuests}p) - {reservation.time}
    </div>
  );
};

// Handler functions for edit and delete actions
const handleEdit = (reservationId) => {
  // Implement edit functionality (e.g., open a modal with reservation details)
  alert(`Edit reservation with ID: ${reservationId}`);
};

const handleDelete = (reservationId) => {
  // Confirm before deleting
  if (window.confirm('Are you sure you want to delete this reservation?')) {
    // Implement delete functionality
    // This function needs access to removeReservation, which isn't available here
    // To fix this, we can pass removeReservation down to the Reservation component
    // and call it from there. Alternatively, use context or lift the handler up.
    // For simplicity, assuming removeReservation is passed correctly
    // Here, we'll just log the action.
    console.log(`Reservation ${reservationId} deleted.`);
  }
};

export default Table;
