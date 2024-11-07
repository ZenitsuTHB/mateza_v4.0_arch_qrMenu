// src/components/FloorPlan.jsx

import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import FloorPlanElement from './FloorPlanElement';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const FloorPlan = () => {
  const [elements, setElements] = useState([]);

  // Handler to add new elements to the floor plan
  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  // Handler to update an existing element's position or properties
  const updateElement = useCallback((id, x, y, updatedProps = {}) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? {
              ...el,
              x: x !== undefined ? x : el.x,
              y: y !== undefined ? y : el.y,
              ...updatedProps,
            }
          : el
      )
    );
  }, []);

  // Handler to remove an element from the floor plan
  const removeElement = useCallback((id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  }, []);

  // Function to snap positions to grid
  const snapToGrid = (x, y, gridSize = 50) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return [snappedX, snappedY];
  };

  // Define the drop target using react-dnd
  const [, drop] = useDrop({
    accept: ['TABLE', 'DECORATION', 'TABLE_ON_FLOOR', 'DECORATION_ON_FLOOR'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = document
        .getElementById('floor-plan-container')
        .getBoundingClientRect();

      let x = offset.x - floorPlanRect.left - item.width / 2;
      let y = offset.y - floorPlanRect.top - item.height / 2;

      // Snap to grid
      const [snappedX, snappedY] = snapToGrid(x, y);
      x = Math.max(0, Math.min(snappedX, floorPlanRect.width - item.width));
      y = Math.max(0, Math.min(snappedY, floorPlanRect.height - item.height));

      if (item.type === 'TABLE' || item.type === 'DECORATION') {
        // Assign a unique ID to each new element
        const id = Date.now();

        addElement({
          id,
          type: item.elementType, // 'table' or 'decoration'
          subtype: item.subtype, // 'round', 'square', 'wall', etc.
          x,
          y,
          width: item.width,
          height: item.height,
          capacity: item.capacity, // only for tables
          name:
            item.type === 'TABLE'
              ? `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Table ${id}`
              : `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Decoration ${id}`,
          minCapacity: item.minCapacity || 1, // only for tables
          maxCapacity: item.maxCapacity || 10, // only for tables
          priority: 'Medium', // default priority for tables
        });
      } else if (item.type === 'TABLE_ON_FLOOR' || item.type === 'DECORATION_ON_FLOOR') {
        // Moving an existing element
        updateElement(item.id, x, y);
      }
    },
  });

  return (
    <ResizableBox
      width={800}
      height={600}
      minConstraints={[400, 300]}
      maxConstraints={[1600, 1200]}
      className="resizable-floor-plan"
    >
      <div id="floor-plan-container" className="floor-plan" ref={drop}>
        {/* Render all elements */}
        {elements.map((el) => (
          <FloorPlanElement
            key={el.id}
            element={el}
            updateElement={updateElement}
            removeElement={removeElement}
          />
        ))}
      </div>
    </ResizableBox>
  );
};

export default FloorPlan;
