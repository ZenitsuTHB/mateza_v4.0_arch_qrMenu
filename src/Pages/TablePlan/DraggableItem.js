import React from 'react';
import { useDrag } from 'react-dnd';
import './css/draggableItem.css';

const DraggableItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ELEMENT',
    item: { 
      elementType: component.type,
      subtype: component.subtype,
      width: component.width,
      height: component.height,
      capacity: component.capacity,
      orientation: component.orientation,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`draggable-item ${isDragging ? 'dragging' : ''}`}
      ref={drag}
    >
      {/* Visual Representation */}
      {component.type === 'table' ? (
        <div
          className={`table ${component.subtype}`}
          style={{ width: component.width / 2, height: component.height / 2 }}
        >
          {/* Optional: Display capacity */}
          <span className="capacity">{component.capacity}</span>
        </div>
      ) : (
        <div
          className={`wall ${component.orientation}`}
          style={{ width: component.width / 2, height: component.height / 2 }}
        ></div>
      )}
      {/* Label */}
      <span className="component-label">{component.label}</span>
    </div>
  );
};

export default DraggableItem;
