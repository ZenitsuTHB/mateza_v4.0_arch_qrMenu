// src/components/DragAndDropEditor/DragAndDropEditor.jsx

import React from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './Palette';
import Canvas from './Canvas';
import './css/dragAndDropEditor.css';
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
  { id: '3', type: 'phone', label: 'Telefoonnummer', icon: <FaPhone /> },
  { id: '4', type: 'email', label: 'Emailadres', icon: <FaEnvelope /> },
  { id: '5', type: 'picture', label: 'Afbeelding', icon: <FaImage /> },
  { id: '6', type: 'textarea', label: 'Tekstveld', icon: <FaFont /> },
  { id: '7', type: 'title', label: 'Titel', icon: <FaHeading /> },
  { id: '8', type: 'paragraph', label: 'Paragraaf', icon: <FaParagraph /> }, // New element
];

const DragAndDropEditor = () => {
  const [blocks] = React.useState(initialBlocks);
  const [canvasItems, setCanvasItems] = React.useState([]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    // Dropping from Palette to Canvas
    if (result.source.droppableId === 'Palette' && result.destination.droppableId === 'Canvas') {
      const item = blocks.find((block) => block.id === result.draggableId);
      const newItem = {
        ...item,
        id: `${item.id}-${new Date().getTime()}`, // Unique ID
      };

      const newCanvasItems = Array.from(canvasItems);
      newCanvasItems.splice(result.destination.index, 0, newItem);
      setCanvasItems(newCanvasItems);
    }
    // Reordering within Canvas
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

  return (
    <div className="editor-container">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Palette blocks={blocks} />
        <Canvas items={canvasItems} setItems={setCanvasItems} />
      </DragDropContext>
    </div>
  );
};

export default withHeader(DragAndDropEditor);
