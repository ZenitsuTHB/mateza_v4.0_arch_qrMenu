// src/components/DragAndDropEditor/Canvas.jsx

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Block from './Block';
import './css/canvas.css';

const Canvas = ({ defaultItems, items, setItems, dropPosition, onDelete }) => {
  // Log items before rendering
  console.log('Canvas component received items:', items);

  return (
    <div className="canvas">
      <Droppable droppableId="Canvas">
        {(provided, snapshot) => (
          <div
            className={`canvas-area ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Render Default Items as Static Blocks */}
            {defaultItems && defaultItems.map(item => (
              <Block key={item.id} {...item} onDelete={onDelete} />
            ))}

            {/* Render User-Added Items as Draggable Blocks */}
            {items && items.map((item, index) => (
              item ? (
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
                        className={`canvas-item ${snapshot.isDragging ? 'dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Block {...item} onDelete={onDelete} />
                      </div>
                    )}
                  </Draggable>
                </React.Fragment>
              ) : null
            ))}

            {/* Drop Indicator for Adding at the End */}
            {dropPosition === items.length && (
              <div className="custom-drop-indicator">
                <div className="drop-line"></div>
                <div className="drop-dot">
                  <span className="plus-sign">+</span>
                </div>
              </div>
            )}

            {provided.placeholder}

            {/* Placeholder Message */}
            {items.length === 0 && defaultItems.length === 0 && (
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
