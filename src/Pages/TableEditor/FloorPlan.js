// FloorPlan.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import FloorPlanElement from './FloorPlanElement.js';

const ALIGN_THRESHOLD = 15; // Threshold in pixels for alignment detection

const FloorPlan = () => {
  const [elements, setElements] = useState([]);
  const floorPlanRef = useRef(null);
  const [floorPlanSize, setFloorPlanSize] = useState({ width: 800, height: 600 });

  // **Add this state to track the next table number**
  const [nextTableNumber, setNextTableNumber] = useState(1);

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

  const rotateElement = useCallback((id) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? {
              ...el,
              rotation: (el.rotation || 0) + 90, // Rotate by 90 degrees
            }
          : el
      )
    );
  }, []);

  const duplicateElement = useCallback((id) => {
    setElements((prevElements) => {
      const elementToDuplicate = prevElements.find((el) => el.id === id);
      if (!elementToDuplicate) return prevElements;
      const newId = Date.now();
      const newElement = {
        ...elementToDuplicate,
        id: newId,
        x: Math.min(elementToDuplicate.x + 20, floorPlanSize.width - elementToDuplicate.width),
        y: Math.min(elementToDuplicate.y + 20, floorPlanSize.height - elementToDuplicate.height),
        name:
          elementToDuplicate.type === 'table'
            ? `T${nextTableNumber}`
            : `${elementToDuplicate.subtype.charAt(0).toUpperCase() + elementToDuplicate.subtype.slice(1)} Decoration ${newId}`,
        rotation: elementToDuplicate.rotation || 0,
      };

      if (elementToDuplicate.type === 'table') {
        newElement.tableNumber = nextTableNumber;
        setNextTableNumber((prev) => prev + 1);
      }

      return [...prevElements, newElement];
    });
  }, [floorPlanSize.width, floorPlanSize.height, nextTableNumber]);

  const deleteElement = useCallback((id) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
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

      let x = offset.x - floorPlanRect.left;
      let y = offset.y - floorPlanRect.top;

      // Apply snapping only if the element is not a wall
      if (item.elementType !== 'wall') {
        const [snappedX, snappedY] = snapToGrid(x, y);
        x = Math.max(0, Math.min(snappedX, floorPlanSize.width - item.width));
        y = Math.max(0, Math.min(snappedY, floorPlanSize.height - item.height));
      } else {
        // For walls, ensure they stay within boundaries without snapping
        x = Math.max(0, Math.min(x, floorPlanSize.width - item.width));
        y = Math.max(0, Math.min(y, floorPlanSize.height - item.height));
      }

      if (item.id) {
        moveElement(item.id, x, y);
      } else {
        const id = Date.now();
        const newElement = {
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
              ? `T${nextTableNumber}`
              : `${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1)} Decoration ${id}`,
          minCapacity: item.minCapacity || 1,
          maxCapacity: item.maxCapacity || 10,
          priority: 'Medium',
          rotation: 0, // Initialize rotation
        };

        // **Assign a tableNumber if the element is a table**
        if (item.elementType === 'table') {
          newElement.tableNumber = nextTableNumber;
          setNextTableNumber((prev) => prev + 1);
        }

        addElement(newElement);
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
      onResizeStop={(e, data) => {
        // Directly set the new size without snapping
        setFloorPlanSize({ width: data.size.width, height: data.size.height });
      }}
      resizeHandles={['se']} // Optional: specify resize handles if needed
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
        {/* Removed alignment lines rendering */}

        {elements.map((el) => (
          <FloorPlanElement
            key={el.id}
            element={el}
            moveElement={moveElement}
            rotateElement={rotateElement}
            duplicateElement={duplicateElement}
            deleteElement={deleteElement}
            floorPlanSize={floorPlanSize}
            // **Pass the tableNumber to FloorPlanElement**
            tableNumber={el.tableNumber}
          />
        ))}
      </div>
    </ResizableBox>
  );
};

export default FloorPlan;
