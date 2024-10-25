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

import { applyResponsiveStyles } from './Utils/responsiveStyles.js';
import useCanvasItems from './Hooks/fetchCanvas.js';

const DragAndDropEditor = () => {
  const [blocks] = useState(initialBlocks);
  const [dropPosition, setDropPosition] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const formEditingPageRef = useRef(null);

  const { triggerNotification, NotificationComponent } = useNotification();
  const { canvasItems, setCanvasItems, loading, error, updateCanvasItemsAPI } = useCanvasItems(triggerNotification);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      applyResponsiveStyles(formEditingPageRef);
    });

    if (formEditingPageRef.current) {
      observer.observe(formEditingPageRef.current);
      applyResponsiveStyles(formEditingPageRef);
    }

    return () => {
      if (formEditingPageRef.current) {
        observer.unobserve(formEditingPageRef.current);
      }
    };
  }, []);

  const handleOnDragEnd = (result) => {
    setDropPosition(null);

    if (!result.destination) return;

    if (result.source.droppableId === 'Palette' && result.destination.droppableId === 'Canvas') {
      const item = blocks.find((block) => block.id === result.draggableId);
      if (!item) return;

      const newItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        placeholder: '',
        required: false,
      };

      const newCanvasItems = Array.from(canvasItems);
      newCanvasItems.splice(result.destination.index, 0, newItem);
      setCanvasItems(newCanvasItems);
      updateCanvasItemsAPI(newCanvasItems);

    } else if (result.source.droppableId === 'Canvas' && result.destination.droppableId === 'Canvas') {
      const items = Array.from(canvasItems);
      const [movedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, movedItem);
      setCanvasItems(items);
      updateCanvasItemsAPI(items);
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

  const handleDelete = (id) => {
    // Prevent deletion of default items
    if (id.startsWith('default-')) return;

    const newItems = canvasItems.filter((item) => item.id !== id);
    setCanvasItems(newItems);
    updateCanvasItemsAPI(newItems);
  };

  console.log('Canvas Items before rendering:', canvasItems);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Combine defaultCanvasItems with fetched canvasItems
  const combinedCanvasItems = [...defaultCanvasItems, ...canvasItems];

  return (
    <div className="form-editing-page" ref={formEditingPageRef}>
      <NotificationComponent />
      <div className="editor-container">
        <DragDropContext onDragEnd={handleOnDragEnd} onDragUpdate={handleOnDragUpdate}>
          <Palette blocks={blocks} />
          <Canvas
            items={combinedCanvasItems} // Pass the combined items here
            setItems={setCanvasItems}
            dropPosition={dropPosition}
            selectedTheme={selectedTheme}
            onDelete={handleDelete}
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
          onSuccess={() => triggerNotification('Thema aangepast', 'success')}
        />
      )}
    </div>
  );
};

export default withHeader(DragAndDropEditor);
