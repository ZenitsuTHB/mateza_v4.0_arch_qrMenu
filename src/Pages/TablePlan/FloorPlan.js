// src/components/FloorPlan.jsx

import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import FloorPlanElement from './FloorPlanElement';
import './css/floorPlan.css';

const FloorPlan = () => {
  const [elements, setElements] = useState([]); // State to store tables and walls

  // Handler to add new elements to the floor plan
  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  // Handler to update an existing element's properties
  const updateElement = (id, newProps) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  // Handler to remove an element from the floor plan
  const removeElement = (id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  };

  // Define the drop target using react-dnd
  const [, drop] = useDrop({
    accept: 'ELEMENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = document
        .getElementById('floor-plan-container')
        .getBoundingClientRect();

      const x = offset.x - floorPlanRect.left;
      const y = offset.y - floorPlanRect.top;

      // Assign a unique ID to each element
      const id = Date.now();

      addElement({
        id,
        type: item.elementType, // 'table' or 'wall'
        subtype: item.subtype, // e.g., 'round', 'square' for tables
        x,
        y,
        width: item.width,
        height: item.height,
        capacity: item.capacity,
        orientation: item.orientation || 'horizontal', // For walls
        priority: 'medium', // Default priority
        name: `Table ${id}`, // Default name
        number: id, // Default number
      });
    },
  });

  return (
    <div id="floor-plan-container" className="floor-plan" ref={drop}>
      {/* Grid Overlay for Snapping */}
      <div className="grid-overlay"></div>

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
  );
};

export default FloorPlan;
