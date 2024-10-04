import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTimes } from 'react-icons/fa';

// Custom TabList component that forwards refs
const TabList = React.forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} {...props} className="react-tabs__tab-list">
    {children}
  </div>
));

// Custom Tab component that forwards refs
const DraggableTab = React.forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} {...props} className="react-tabs__tab">
    {children}
  </div>
));

const DraggableTabList = ({ tabs, selectedIndex, setSelectedIndex, closeTab }) => (
  <Droppable droppableId="droppable-tabs" direction="horizontal">
    {(provided) => (
      <TabList
        ref={provided.innerRef}
        {...provided.droppableProps}
        style={{ display: 'flex', flexGrow: 1 }}
      >
        {tabs.map((tab, index) => (
          <Draggable key={tab.id} draggableId={tab.id} index={index}>
            {(provided) => (
              <DraggableTab
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => setSelectedIndex(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  ...provided.draggableProps.style,
                }}
              >
                {tab.label}
                <FaTimes
                  className="close-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id, index);
                  }}
                />
              </DraggableTab>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </TabList>
    )}
  </Droppable>
);

export default DraggableTabList;
