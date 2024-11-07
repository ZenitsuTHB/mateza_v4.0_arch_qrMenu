// FloorPlan.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import FloorPlanElement from './FloorPlanElement.js';

const FloorPlan = () => {
  const [elements, setElements] = useState([]);
  const floorPlanRef = useRef(null);
  const [floorPlanSize, setFloorPlanSize] = useState({ width: 800, height: 600 });

  // Update floor plan size on mount and when resized
  useEffect(() => {
    const updateSize = () => {
      if (floorPlanRef.current) {
        const { width, height } = floorPlanRef.current.getBoundingClientRect();
        setFloorPlanSize({ width, height });
      }
    };

    // Initial size
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  const moveElement = useCallback((id, x, y) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? {
              ...el,
              x,
              y,
            }
          : el
      )
    );
  }, []);

  const snapToGrid = (x, y, gridSize = 50) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return [snappedX, snappedY];
  };

  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = floorPlanRef.current.getBoundingClientRect();

      let x = offset.x - floorPlanRect.left - item.width / 2;
      let y = offset.y - floorPlanRect.top - item.height / 2;

      const [snappedX, snappedY] = snapToGrid(x, y);
      x = Math.max(0, Math.min(snappedX, floorPlanSize.width - item.width));
      y = Math.max(0, Math.min(snappedY, floorPlanSize.height - item.height));

      if (item.id) {
        moveElement(item.id, x, y);
      } else {
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
            item.elementType === 'table'
              ? `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Table ${id}`
              : `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Decoration ${id}`,
          minCapacity: item.minCapacity || 1,
          maxCapacity: item.maxCapacity || 10,
          priority: 'Medium',
        });
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
      onResizeStop={() => {
        if (floorPlanRef.current) {
          const { width, height } = floorPlanRef.current.getBoundingClientRect();
          setFloorPlanSize({ width, height });
        }
      }}
    >
      <div
        id="floor-plan-container"
        className="table-plan-component floor-plan"
        ref={(node) => {
          drop(node);
          floorPlanRef.current = node;
        }}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        {elements.map((el) => (
          <FloorPlanElement
            key={el.id}
            element={el}
            moveElement={moveElement}
            floorPlanSize={floorPlanSize}
          />
        ))}
      </div>
    </ResizableBox>
  );
};

export default FloorPlan;
