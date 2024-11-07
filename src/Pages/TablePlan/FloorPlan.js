// FloorPlan.js
import React, { useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import Table from './Table.js';
import Walls from './Walls.js';

const FloorPlan = () => {
  const [elements, setElements] = useState([]);

  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

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

  const removeElement = useCallback((id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
  }, []);

  const snapToGrid = (x, y, gridSize = 50) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return [snappedX, snappedY];
  };

  const [, drop] = useDrop({
    accept: ['TABLE', 'DECORATION', 'TABLE_ON_FLOOR', 'DECORATION_ON_FLOOR'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = document
        .getElementById('floor-plan-container')
        .getBoundingClientRect();

      let x = offset.x - floorPlanRect.left - item.width / 2;
      let y = offset.y - floorPlanRect.top - item.height / 2;

      const [snappedX, snappedY] = snapToGrid(x, y);
      x = Math.max(0, Math.min(snappedX, floorPlanRect.width - item.width));
      y = Math.max(0, Math.min(snappedY, floorPlanRect.height - item.height));

      if (item.type === 'TABLE' || item.type === 'DECORATION') {
        const id = Date.now();

        addElement({
          id,
          type: item.elementType,
          subtype: item.subtype,
          x,
          y,
          width: item.width,
          height: item.height,
          capacity: item.capacity,
          name:
            item.type === 'TABLE'
              ? `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Table ${id}`
              : `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Decoration ${id}`,
          minCapacity: item.minCapacity || 1,
          maxCapacity: item.maxCapacity || 10,
          priority: 'Medium',
        });
      } else if (item.type === 'TABLE_ON_FLOOR' || item.type === 'DECORATION_ON_FLOOR') {
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
      className="table-plan-component resizable-floor-plan"
    >
      <div id="floor-plan-container" className="table-plan-component floor-plan" ref={drop}>
        {elements.map((el) => {
          const style = {
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
          };
          return el.type === 'table' ? (
            <div key={el.id} style={style}>
              <Table numberOfGuests={el.capacity} />
            </div>
          ) : el.type === 'wall' ? (
            <div key={el.id} style={style}>
              <Walls length={el.width / 20 + 1} />
            </div>
          ) : null;
        })}
      </div>
    </ResizableBox>
  );
};

export default FloorPlan;
