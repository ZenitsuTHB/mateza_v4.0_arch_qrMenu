// src/components/DragAndDropEditor/DragAndDropEditor.js

import React, { useState, useEffect, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { FaMagic } from 'react-icons/fa';
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './DragAndDrop/Palette.js';
import Canvas from './DragAndDrop/Canvas.js';
import ThemeSelectorModal from './Theme/index.js';
import useNotification from '../../Components/Notification/index';
import { initialBlocks } from './defaultElements.js';

import { applyResponsiveStyles } from './Utils/responsiveStyles.js';
import useApi from '../../Hooks/useApi.js';

const DragAndDropEditor = () => {
  const [blocks] = useState(initialBlocks);
  const [canvasItems, setCanvasItems] = useState([]);
  const [dropPosition, setDropPosition] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const formEditingPageRef = useRef(null);
  const previousCanvasItemsRef = useRef(null);
  const { triggerNotification, NotificationComponent } = useNotification();
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchCanvasItems = async () => {
      try {
        console.log('Fetching canvas items from server...');
        const response = await api.get(`${window.baseDomain}api/fields/`);
        console.log('Raw data received from server:', response);

        const data = response || [];

        let parsedData;
        if (Array.isArray(data)) {
          parsedData = data;
        } else if (typeof data === 'object' && data !== null) {
          parsedData = Object.values(data);
          console.log('Converted object data to array:', parsedData);
        } else {
          parsedData = [];
        }

        setCanvasItems(parsedData);
        previousCanvasItemsRef.current = parsedData;
        setLoading(false);
      } catch (err) {
        console.error('Error fetching canvas items:', err);
        setError('Error fetching canvas items');
        setLoading(false);
      }
    };

    fetchCanvasItems();
  }, [api]);

  const updateAPI = (newCanvasItems) => {
    if (JSON.stringify(previousCanvasItemsRef.current) !== JSON.stringify(newCanvasItems)) {
      const updateFields = async () => {
        try {
          console.log('Updating fields on server with:', newCanvasItems);
          await api.put(`${window.baseDomain}api/fields/`, newCanvasItems);
          console.log('Fields updated successfully');
        } catch (err) {
          console.error('Error updating fields:', err);
          const errorCode = err.response?.status || 'unknown';
          triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
        }
      };

      updateFields();
      previousCanvasItemsRef.current = newCanvasItems;
    }
  };

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
      updateAPI(newCanvasItems);

    } else if (result.source.droppableId === 'Canvas' && result.destination.droppableId === 'Canvas') {
      const items = Array.from(canvasItems);
      const [movedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, movedItem);
      setCanvasItems(items);
      updateAPI(items);
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
    const newItems = canvasItems.filter((item) => item.id !== id);
    setCanvasItems(newItems);
    updateAPI(newItems);
  };

  console.log('Canvas Items before rendering:', canvasItems);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
