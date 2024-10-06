// src/components/DragAndDropEditor/Canvas.jsx

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Block from './Block';
import './css/canvas.css';

const Canvas = ({ items, setItems }) => {
  const handleDelete = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  return (
    <div className="canvas">
      <Droppable droppableId="Canvas">
        {(provided, snapshot) => (
          <div
            className={`canvas-area ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`canvas-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    // Remove dragHandleProps from here
                  >
                    <Block
                      type={item.type}
                      label={item.label}
                      id={item.id}
                      onDelete={handleDelete}
                      provided={provided}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {items.length === 0 && (
              <div className="canvas-placeholder">Sleep hier uw elementen naartoe</div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Canvas;
