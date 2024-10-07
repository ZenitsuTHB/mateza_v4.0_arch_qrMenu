// src/components/DragAndDropEditor/Canvas.jsx

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Block from './Block';
import './css/canvas.css';

const Canvas = ({ items, setItems, dropPosition }) => {
  const handleDelete = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  return (
    <div className="canvas">
      <Droppable droppableId="Canvas">
        {(provided, snapshot) => (
          <div
            className={`canvas-area ${
              snapshot.isDraggingOver ? 'is-dragging-over' : ''
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {dropPosition === index && (
                  <div className="custom-drop-indicator">
                    <div className="drop-line"></div>
                    <div className="drop-dot">
                      <span className="plus-sign">+</span>
                    </div>
                  </div>
                )}
                <Draggable draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`canvas-item ${
                        snapshot.isDragging ? 'dragging' : ''
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Block
                        type={item.type}
                        label={item.label}
                        id={item.id}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
                </Draggable>
              </React.Fragment>
            ))}
            {dropPosition === items.length && (
              <div className="custom-drop-indicator">
                <div className="drop-line"></div>
                <div className="drop-dot">
                  <span className="plus-sign">+</span>
                </div>
              </div>
            )}
            {provided.placeholder}
            {items.length === 0 && (
              <div className="canvas-placeholder">
                Sleep hier uw elementen naartoe
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Canvas;
