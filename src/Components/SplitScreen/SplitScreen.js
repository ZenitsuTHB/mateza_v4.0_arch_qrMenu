// Components/SplitScreen/SplitScreen.js
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PaneNavigator from '../PaneNavigator/PaneNavigator.js';
import './SplitScreen.css';

import Home from '../../Pages/Home/index.js';
import About from '../../Pages/About/index.js';

const SplitScreen = () => {
  const [leftPaneContent, setLeftPaneContent] = useState(<Home title="Home" />);
  const [tabs, setTabs] = useState([
    { id: '2', label: 'About', component: <About title="About" /> },
    { id: '3', label: 'Home', component: <Home title="Home" /> },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSplit, setIsSplit] = useState(true);

  // Function to close a tab
  const closeTab = (tabId, index) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // Adjust selected index if the current tab is closed
    if (selectedIndex >= index && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    // If there are no more tabs in the right pane, collapse the split
    if (newTabs.length === 0) {
      setIsSplit(false);
    }
  };

  // Function to handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Dragging from right pane to left pane
    if (source.droppableId === 'droppable-tabs' && destination.droppableId === 'left-pane') {
      const movedTab = tabs[source.index];
      setLeftPaneContent(movedTab.component);

      const newTabs = Array.from(tabs);
      newTabs.splice(source.index, 1);
      setTabs(newTabs);

      if (selectedIndex >= source.index) {
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }

      if (newTabs.length === 0) {
        setIsSplit(false);
      }
    }
    // Rearranging tabs within right pane
    else if (source.droppableId === 'droppable-tabs' && destination.droppableId === 'droppable-tabs') {
      const reorderedTabs = Array.from(tabs);
      const [removed] = reorderedTabs.splice(source.index, 1);
      reorderedTabs.splice(destination.index, 0, removed);

      setTabs(reorderedTabs);

      if (source.index === selectedIndex) {
        setSelectedIndex(destination.index);
      } else if (source.index < selectedIndex && destination.index >= selectedIndex) {
        setSelectedIndex((prevIndex) => prevIndex - 1);
      } else if (source.index > selectedIndex && destination.index <= selectedIndex) {
        setSelectedIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  return (
    <div className="split-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        {isSplit ? (
          <SplitPane
            split="vertical"
            minSize={0}
            maxSize={-1}
            defaultSize="50%"
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <div>
              <Droppable droppableId="left-pane" isDropDisabled={false}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="left-pane"
                  >
                    {leftPaneContent}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <PaneNavigator
              tabs={tabs}
              setTabs={setTabs}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              closeTab={closeTab} // Pass the closeTab function
            />
          </SplitPane>
        ) : (
          <div className="left-pane full-width">
            {leftPaneContent}
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default SplitScreen;
