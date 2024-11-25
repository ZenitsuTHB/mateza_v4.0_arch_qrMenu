// FloorPlan.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import './css/floorPlan.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import FloorPlanElement from './FloorPlanElement.js';
import TableEditModalContent from './TableEditModalContent'; // Ensure correct path
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard/index.js'; // Ensure correct path
import useApi from '../../../Hooks/useApi.js'; // Ensure correct path

const ALIGN_THRESHOLD = 15; // Threshold in pixels for alignment detection

const FloorPlan = () => {
  const [elements, setElements] = useState([]);
  const floorPlanRef = useRef(null);
  const [floorPlanSize, setFloorPlanSize] = useState({ width: 800, height: 600 });
  const [nextTableNumber, setNextTableNumber] = useState(1);

  const api = useApi(); // Initialize useApi hook

  // State for modal
  const [selectedElement, setSelectedElement] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // Load tables from API on mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/tables`, { noCache: true });
        // Ensure that data is an array
        if (Array.isArray(data)) {
          setElements(data);
        } else if (data && Array.isArray(data.tables)) { // If API returns { tables: [...] }
          setElements(data.tables);
        } else {
          setElements([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        setElements([]); // Fallback to empty array on error
      }
    };

    fetchTables();
  }, [api]);

  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  const updateElement = (updatedElement) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
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

  const duplicateElement = useCallback(
    (id) => {
      setElements((prevElements) => {
        const elementToDuplicate = prevElements.find((el) => el.id === id);
        if (!elementToDuplicate) return prevElements;
        const newId = Date.now();
        const newElement = {
          ...elementToDuplicate,
          id: newId,
          x: Math.min(
            elementToDuplicate.x + 20,
            floorPlanSize.width - elementToDuplicate.width
          ),
          y: Math.min(
            elementToDuplicate.y + 20,
            floorPlanSize.height - elementToDuplicate.height
          ),
          name:
            elementToDuplicate.type === 'table'
              ? `T${nextTableNumber}`
              : `${elementToDuplicate.subtype.charAt(0).toUpperCase() +
                  elementToDuplicate.subtype.slice(1)} Decoration ${newId}`,
          rotation: elementToDuplicate.rotation || 0,
        };

        if (elementToDuplicate.type === 'table') {
          newElement.tableNumber = nextTableNumber;
          setNextTableNumber((prev) => prev + 1);
        }

        // **Removed modal opening on duplication**
        // setSelectedElement(newElement);
        // setShowModal(true);

        return [...prevElements, newElement];
      });
    },
    [floorPlanSize.width, floorPlanSize.height, nextTableNumber]
  );

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

        // Assign a tableNumber if the element is a table
        if (item.elementType === 'table') {
          newElement.tableNumber = nextTableNumber;
          setNextTableNumber((prev) => prev + 1);
        }

        addElement(newElement);

        // **Open modal to edit table details only if needed**
        setSelectedElement(newElement);
        setShowModal(true);
      }
    },
  });

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedElement(null);
  };

  const handleModalSave = (updatedElement) => {
    // Update the element in state
    updateElement(updatedElement);
    setShowModal(false);
    setSelectedElement(null);

    // Save the element to API
    const saveElement = async () => {
      try {
        if (updatedElement._id) {
          // Existing table: use PUT request
          await api.put(`${window.baseDomain}api/tables/${updatedElement._id}`, updatedElement);
        } else {
          // New table: use POST request
          await api.post(`${window.baseDomain}api/tables`, updatedElement);
        }
      } catch (error) {
        console.error('Error saving table:', error);
      }
    };

    saveElement();
  };

  return (
    <>
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
          {Array.isArray(elements) && elements.map((el) => (
            <FloorPlanElement
              key={el.id}
              element={el}
              moveElement={moveElement}
              rotateElement={rotateElement}
              duplicateElement={duplicateElement}
              deleteElement={deleteElement}
              floorPlanSize={floorPlanSize}
              tableNumber={el.tableNumber}
              openModal={(element) => {
                setSelectedElement(element);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      </ResizableBox>
      {showModal && selectedElement && (
        <ModalWithoutTabs
          onClose={handleModalClose}
          content={
            <TableEditModalContent
              element={selectedElement}
              onSave={handleModalSave}
              onClose={handleModalClose}
            />
          }
        />
      )}
    </>
  );
};

export default FloorPlan;
