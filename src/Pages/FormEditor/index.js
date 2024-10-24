// src/components/DragAndDropEditor/DragAndDropEditor.js

import React, { useState, useEffect, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { FaMagic } from 'react-icons/fa';
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './DragAndDrop/Palette.js';
import Canvas from './DragAndDrop/Canvas.js';
import ThemeSelectorModal from './Theme/index.js';
import useNotification from '../../Components/Notification/index';
import { initialBlocks, defaultCanvasItems } from './defaultElements.js';

// Import the applyResponsiveStyles function
import { applyResponsiveStyles } from './Utils/responsiveStyles.js';

const DragAndDropEditor = () => {
  const [blocks] = useState(initialBlocks);
  const [canvasItems, setCanvasItems] = useState(() => {
    const savedItems = localStorage.getItem('canvasItems');
    if (savedItems) {
      return JSON.parse(savedItems);
    } else {
      return defaultCanvasItems;
    }
  });
  const [dropPosition, setDropPosition] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const formEditingPageRef = useRef(null);
  const { triggerNotification, NotificationComponent } = useNotification();

  // Apply responsive styles by using the imported function
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      applyResponsiveStyles(formEditingPageRef);
    });

    if (formEditingPageRef.current) {
      observer.observe(formEditingPageRef.current);
      // Apply styles initially
      applyResponsiveStyles(formEditingPageRef);
    }

    return () => {
      if (formEditingPageRef.current) {
        observer.unobserve(formEditingPageRef.current);
      }
    };
  }, []);

  // Save canvasItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('canvasItems', JSON.stringify(canvasItems));
  }, [canvasItems]);

  const handleOnDragEnd = (result) => {
    setDropPosition(null);

    if (!result.destination) return;
    if (
      result.source.droppableId === 'Palette' &&
      result.destination.droppableId === 'Canvas'
    ) {
      const item = blocks.find((block) => block.id === result.draggableId);
      if (!item) return;

      const newItem = {
        ...item,
        id: `${item.id}-${Date.now()}`, // Unique ID
        placeholder: '',
        required: false,
      };

      const newCanvasItems = Array.from(canvasItems);
      newCanvasItems.splice(result.destination.index, 0, newItem);
      setCanvasItems(newCanvasItems);
    } else if (
      result.source.droppableId === 'Canvas' &&
      result.destination.droppableId === 'Canvas'
    ) {
      const items = Array.from(canvasItems);
      const [movedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, movedItem);
      setCanvasItems(items);
    }
  };

  const handleOnDragUpdate = (update) => {
    const { destination } = update;
    if (!destination) {
      setDropPosition(null);
      return;
    }
    setDropPosition(destination.index);
  };

  return (
    <div className="form-editing-page" ref={formEditingPageRef}>
      <NotificationComponent />
      <div className="editor-container">
        <DragDropContext onDragEnd={handleOnDragEnd} onDragUpdate={handleOnDragUpdate}>
          <Palette blocks={blocks} />
          <Canvas
            items={canvasItems}
            setItems={setCanvasItems}
            dropPosition={dropPosition}
            selectedTheme={selectedTheme}
          />
        </DragDropContext>
      </div>
      <button className="button-style-2 themes-button" onClick={() => setShowThemeModal(true)}>
        <FaMagic className="button-style-2-icon icon" />
        Stijl Kiezen
      </button>
      {showThemeModal && (
        <ThemeSelectorModal
          onClose={() => setShowThemeModal(false)}
          onSuccess={() => triggerNotification("Thema aangepast", "success")}
        />
      )}
    </div>
  );
};

export default withHeader(DragAndDropEditor);
