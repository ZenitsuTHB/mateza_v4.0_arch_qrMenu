// Components/LeftPane/LeftPane.js
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const LeftPane = ({ leftPaneContent, isSplit }) => (
  <Droppable droppableId="left-pane" isDropDisabled={false}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`left-pane ${isSplit ? '' : 'full-width'}`}
      >
        {leftPaneContent}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default LeftPane;
