import React, { useState, useEffect, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { FaMagic } from 'react-icons/fa'; // Import the sparkle icon
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './Palette.js';
import Canvas from './Canvas.js';
import './css/animations.css';
import './css/style.css';
import './css/mobile.css';

import {
  FaFont,
  FaEnvelope,
  FaPhone,
  FaImage,
  FaList,
  FaHeading,
  FaKeyboard,
  FaParagraph,
} from 'react-icons/fa';

const initialBlocks = [
  { id: '1', type: 'input', label: 'Invoerveld', icon: <FaKeyboard /> },
  { id: '2', type: 'select', label: 'Selectievak', icon: <FaList /> },
  { id: '3', type: 'phone', label: 'Telefoon', icon: <FaPhone /> },
  { id: '4', type: 'email', label: 'Email', icon: <FaEnvelope /> },
  { id: '5', type: 'picture', label: 'Afbeelding', icon: <FaImage /> },
  { id: '6', type: 'textarea', label: 'Tekstveld', icon: <FaFont /> },
  { id: '7', type: 'title', label: 'Titel', icon: <FaHeading /> },
  { id: '8', type: 'paragraph', label: 'Paragraaf', icon: <FaParagraph /> }, // New element
];

const DragAndDropEditor = () => {
  const [blocks] = useState(initialBlocks);
  const [canvasItems, setCanvasItems] = useState([]);
  const [dropPosition, setDropPosition] = useState(null); // Track drop position
  const formEditingPageRef = useRef(null); // Reference to the .form-editing-page container

  useEffect(() => {
    const applyResponsiveStyles = () => {
      const container = formEditingPageRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const palette = container.querySelector('.palette');
        const editorContainer = container.querySelector('.editor-container');
        const canvas = container.querySelector('.canvas');

        if (containerWidth <= 900) {
          palette?.classList.add('palette-responsive');
          editorContainer?.classList.add('editor-container-responsive');
          canvas?.classList.add('canvas-responsive');
        } else {
          palette?.classList.remove('palette-responsive');
          editorContainer?.classList.remove('editor-container-responsive');
          canvas?.classList.remove('canvas-responsive');
        }
      }
    };

    const observer = new ResizeObserver(() => {
      applyResponsiveStyles();
    });

    if (formEditingPageRef.current) {
      observer.observe(formEditingPageRef.current);
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
      const newItem = {
        ...item,
        id: `${item.id}-${new Date().getTime()}`,
      };

      const newCanvasItems = Array.from(canvasItems);
      newCanvasItems.splice(result.destination.index, 0, newItem);
      setCanvasItems(newCanvasItems);
    }
    else if (
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
      <div className="editor-container">
        <DragDropContext onDragEnd={handleOnDragEnd} onDragUpdate={handleOnDragUpdate}>
          <Palette blocks={blocks} />
          <Canvas items={canvasItems} setItems={setCanvasItems} dropPosition={dropPosition} />
        </DragDropContext>
      </div>
        <button className="themes-button">
          <FaMagic className="icon" />
          Stijl Kiezen
        </button>
    </div>
  );
};

export default withHeader(DragAndDropEditor);
