// src/components/FloorPlanElement.jsx

import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import Table from './Table';
import Wall from './Wall';
import './css/floorPlanElement.css';
import 'react-resizable/css/styles.css'; // Import react-resizable styles

const FloorPlanElement = ({ element, updateElement, removeElement }) => {
  const [isSelected, setIsSelected] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'FLOOR_ELEMENT',
    item: { id: element.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Handler for resizing
  const handleResize = (event, { size }) => {
    updateElement(element.id, { width: size.width, height: size.height });
  };

  // Handler for selecting the element
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering floor plan's click
    setIsSelected(!isSelected);
    // Optionally, open modal here or trigger parent callback
  };

  // Determine which component to render based on type
  const renderElement = () => {
    if (element.type === 'table') {
      return <Table subtype={element.subtype} />;
    } else if (element.type === 'wall') {
      return <Wall orientation={element.orientation} />;
    }
    return null;
  };

  return (
    <ResizableBox
      width={element.width}
      height={element.height}
      onResize={handleResize}
      className={`floor-plan-element ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isSelected ? 2 : 1,
      }}
      draggable
    >
      <div ref={drag} onClick={handleClick}>
        {renderElement()}
      </div>
      {/* Delete Button (Visible when selected) */}
      {isSelected && (
        <button
          className="delete-button"
          onClick={() => removeElement(element.id)}
        >
          &times;
        </button>
      )}
    </ResizableBox>
  );
};

export default FloorPlanElement;
