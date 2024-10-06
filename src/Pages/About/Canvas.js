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
            className={`canvas-area`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <Droppable droppableId={`dropzone-${index}`} type="dropzone">
                  {(providedDropZone, snapshotDropZone) => (
                    <div
                      className={`dropzone ${
                        snapshotDropZone.isDraggingOver ? 'active' : ''
                      }`}
                      ref={providedDropZone.innerRef}
                      {...providedDropZone.droppableProps}
                    >
                      {providedDropZone.placeholder}
                    </div>
                  )}
                </Droppable>

                <Draggable draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`canvas-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
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
              </React.Fragment>
            ))}
            {/* Add a dropzone at the end */}
            <Droppable droppableId={`dropzone-${items.length}`} type="dropzone">
              {(providedDropZone, snapshotDropZone) => (
                <div
                  className={`dropzone ${
                    snapshotDropZone.isDraggingOver ? 'active' : ''
                  }`}
                  ref={providedDropZone.innerRef}
                  {...providedDropZone.droppableProps}
                >
                  {providedDropZone.placeholder}
                </div>
              )}
            </Droppable>
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
