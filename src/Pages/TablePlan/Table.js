// Table.js
import React from 'react';
import { useDrag } from 'react-dnd';
import './css/table.css';

const Table = ({ capacity, reservations, tableId, removeReservation, isActive }) => {
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

  // Prepare tooltip content
  const tooltipContent = reservations
    .map((res) => `${res.firstName} ${res.lastName} (${res.numberOfGuests}p) - ${res.time}`)
    .join('\n');

  return (
    <div
      className={`table-plan-component table-container ${isOccupied ? 'occupied' : ''}`}
      style={{ width: `${tableWidth}px`, height: `${tableHeight + 80}px` }}
    >
      {/* Tooltip */}
      {isOccupied && (
        <div className="tooltip">
          {reservations.map((res) => (
            <div key={res.id}>
              {res.firstName} {res.lastName} ({res.numberOfGuests}p) - {res.time}
            </div>
          ))}
        </div>
      )}

      <div
        className={`table-plan-component chairs top-chairs ${isOccupied ? 'chairs-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {topChairs.map((chair, index) => (
          <div key={`top-${index}`} className="table-plan-component chair"></div>
        ))}
      </div>
      <div
        className={`table-plan-component table ${isOccupied ? 'table-occupied' : ''}`}
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
        className={`table-plan-component chairs bottom-chairs ${isOccupied ? 'chairs-occupied' : ''}`}
        style={{
          width: `${tableWidth}px`,
        }}
      >
        {bottomChairs.map((chair, index) => (
          <div key={`bottom-${index}`} className="table-plan-component chair"></div>
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

export default Table;
