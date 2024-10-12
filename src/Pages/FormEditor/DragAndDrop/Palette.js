// src/components/DragAndDropEditor/Palette.jsx

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import '../css/DragAndDrop/palette.css';
import { FaGripHorizontal } from 'react-icons/fa';

const Palette = ({ blocks }) => (
  <div className="palette">
    <Droppable droppableId="Palette" isDropDisabled={true}>
      {(provided) => (
        <div
          className="palette-blocks"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {blocks.map((block, index) => (
            <Draggable key={block.id} draggableId={block.id} index={index}>
              {(provided, snapshot) => (
                <div
                  className={`palette-block ${
                    snapshot.isDragging ? 'dragging' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <span className="palette-drag-icon">
                    <FaGripHorizontal />
                  </span>
                  <span className="icon">{block.icon}</span>
                  <span className="label">{block.label}</span>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default Palette;
