// Components/SplitScreen/SplitScreen.js
import React, { useState, useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TabNavigator from './TabNavigator.js';
import './css/style.css';

import Home from '../../../Pages/Home/index.js';
import Notepad from '../../../Pages/Notepad/index.js';

const SplitScreen = () => {
  const [leftPaneContent, setLeftPaneContent] = useState(<Home title="Home" />);
  const [tabs, setTabs] = useState([
    { id: '2', label: 'Notities', component: <Notepad title="Notities" /> },
    { id: '3', label: 'Home', component: <Home title="Home" /> },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSplit, setIsSplit] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeTab = (tabId, index) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (selectedIndex >= index && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }

    if (newTabs.length === 0) {
      setIsSplit(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
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
        {isMobile || !isSplit ? (
          <div className="left-pane full-width">
            {leftPaneContent}
          </div>
        ) : (
          <SplitPane
            split="vertical"
            minSize={0}
            maxSize={-10}
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
            <TabNavigator
              tabs={tabs}
              setTabs={setTabs}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              closeTab={closeTab}
            />
          </SplitPane>
        )}
      </DragDropContext>
    </div>
  );
};

export default SplitScreen;