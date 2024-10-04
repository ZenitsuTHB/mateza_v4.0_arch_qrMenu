import React, { useState } from 'react';
import { Tab, Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DragDropContext } from 'react-beautiful-dnd';

import Home from '../../Pages/Home/index.js';
import About from '../../Pages/About/index.js';

import DraggableTabList from './DraggableTabList'; // Import the new component
import './PaneNavigator.css';

const PaneNavigator = () => {
  const [tabs, setTabs] = useState([
    { id: '1', label: 'Home', component: <Home title="Home" /> },
    { id: '2', label: 'About', component: <About title="About" /> },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const closeTab = (tabId, index) => {
    if (tabs.length === 1) return;

    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));

    if (selectedIndex >= index) {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTabs = Array.from(tabs);
    const [removed] = reorderedTabs.splice(result.source.index, 1);
    reorderedTabs.splice(result.destination.index, 0, removed);

    setTabs(reorderedTabs);

    // Adjust selectedIndex if necessary
    if (result.source.index === selectedIndex) {
      setSelectedIndex(result.destination.index);
    } else if (
      result.source.index < selectedIndex &&
      result.destination.index >= selectedIndex
    ) {
      setSelectedIndex((prevIndex) => prevIndex - 1);
    } else if (
      result.source.index > selectedIndex &&
      result.destination.index <= selectedIndex
    ) {
      setSelectedIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Tabs
        className="paneNavigator"
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <DraggableTabList
          tabs={tabs}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          closeTab={closeTab}
        />
        {tabs.map((tab) => (
          <TabPanel key={tab.id}>{tab.component}</TabPanel>
        ))}
      </Tabs>
    </DragDropContext>
  );
};

export default PaneNavigator;
