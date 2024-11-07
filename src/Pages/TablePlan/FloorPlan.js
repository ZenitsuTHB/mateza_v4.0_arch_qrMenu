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

  // State for alignment lines (only vertical)
  const [alignmentLines, setAlignmentLines] = useState({
    vertical: [],
  });

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

  const snapSize = (size, gridSize = 50) => {
    const snappedWidth = Math.round(size.width / gridSize) * gridSize;
    const snappedHeight = Math.round(size.height / gridSize) * gridSize;
    return { width: snappedWidth, height: snappedHeight };
  };

  const [, drop] = useDrop({
    accept: 'ITEM',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const floorPlanRect = floorPlanRef.current.getBoundingClientRect();

      // Position based on top-left corner
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

  // Function to handle dragging positions from FloorPlanElement
  const handleDragging = useCallback(
    (draggingId, currentX, currentY, elementWidth, elementHeight) => {
      const draggingElement = elements.find(el => el.id === draggingId);
      if (draggingElement.type === 'wall') {
        // Do not apply alignment or snapping for walls
        setAlignmentLines({ vertical: [] });
        setSnappedPosition({ x: null });
        return;
      }

      const lines = { vertical: [] };
      let snappedX = currentX;

      elements.forEach((el) => {
        if (el.id === draggingId || el.type === 'wall') return; // Skip the element being dragged and walls

        // Vertical Alignments - Only Left Edge
        if (Math.abs(currentX - el.x) <= ALIGN_THRESHOLD) {
          lines.vertical.push({
            x: el.x,
            yStart: 0,
            yEnd: floorPlanSize.height,
          });
          snappedX = el.x;
        }
      });

      // Update alignment lines
      setAlignmentLines(lines);

      // Implement snapping by updating the position
      setSnappedPosition({ x: snappedX });
    },
    [elements, floorPlanSize.height]
  );

  // State to hold snapped position (only x)
  const [snappedPosition, setSnappedPosition] = useState({ x: null });

  // Function to clear alignment lines when not dragging
  const clearAlignmentLines = useCallback(() => {
    setAlignmentLines({ vertical: [] });
    setSnappedPosition({ x: null });
  }, []);

  return (
    <ResizableBox
      width={800}
      height={600}
      minConstraints={[400, 300]}
      maxConstraints={[1600, 1200]}
      className="table-plan-component resizable-floor-plan"
      onResizeStop={(e, data) => {
        const { width, height } = snapSize(data.size);
        setFloorPlanSize({ width, height });
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
        {/* Render Vertical Alignment Lines */}
        {alignmentLines.vertical.map((line, index) => (
          <div
            key={`v-line-${index}`}
            className="alignment-line vertical-line"
            style={{
              left: `${line.x}px`,
              top: `${line.yStart}px`,
              height: `${line.yEnd - line.yStart}px`,
            }}
          />
        ))}

        {elements.map((el) => (
          <FloorPlanElement
            key={el.id}
            element={el}
            moveElement={moveElement}
            floorPlanSize={floorPlanSize}
            onDrag={handleDragging}
            onDragEnd={clearAlignmentLines}
            snappedPosition={snappedPosition}
          />
        ))}
      </div>
    </ResizableBox>
  );
};

export default FloorPlan;
