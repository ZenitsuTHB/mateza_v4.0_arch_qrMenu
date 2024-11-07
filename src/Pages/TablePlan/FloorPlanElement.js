// FloorPlanElement.js (Optional: If you want to handle different element types differently)
import React from 'react';
import { useDrag } from 'react-dnd';
import Table from './Table.js';
import Walls from './Walls.js';

const FloorPlanElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: {
      id: element.id,
      elementType: element.type,
      subtype: element.subtype,
      width: element.width,
      height: element.height,
      capacity: element.capacity,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [element]);

  const style = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
  };

  return (
    <div className="table-plan-component floor-plan-element" ref={drag} style={style}>
      {element.type === 'table' ? (
        <Table numberOfGuests={element.capacity} />
      ) : element.type === 'wall' ? (
        <Walls length={element.width / 20 + 1} />
      ) : null}
    </div>
  );
};

export default FloorPlanElement;
