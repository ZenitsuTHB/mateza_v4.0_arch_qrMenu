// FloorPlanElement.js
import React from 'react';
import { useDrop } from 'react-dnd';
import Table from './Table.js';

const FloorPlanElement = ({
  table,
  reservations,
  assignReservation,
  removeReservation,
  floorPlanSize,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'GUEST',
    drop: (item, monitor) => {
      assignReservation(item.id, table.id);
    },
    canDrop: (item, monitor) => {
      // Check if table can accommodate the reservation
      const currentGuests = reservations.reduce((acc, res) => acc + res.numberOfGuests, 0);
      return currentGuests + item.numberOfGuests <= table.capacity;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      style={{
        position: 'absolute',
        left: `${table.x}px`,
        top: `${table.y}px`,
      }}
    >
      <Table
        capacity={table.capacity}
        reservations={reservations}
        tableId={table.id}
        removeReservation={removeReservation}
        isActive={isActive}
      />
    </div>
  );
};

export default FloorPlanElement;
