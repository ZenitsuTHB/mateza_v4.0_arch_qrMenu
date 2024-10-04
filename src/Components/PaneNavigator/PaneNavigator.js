// Components/PaneNavigator/PaneNavigator.js
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Home from '../../Pages/Home/index.js';
import About from '../../Pages/About/index.js';

import './PaneNavigator.css'
// Import other components as needed

const PaneNavigator = () => {
  return (
    <Tabs className="navigationTabs">
      <TabList>
        <Tab>Home</Tab>
        <Tab>About</Tab>
        {/* Add more tabs as needed */}
      </TabList>

      <TabPanel>
        <Home title="Home" />
      </TabPanel>
      <TabPanel>
        <About title="About" />
      </TabPanel>
      {/* Add more TabPanels as needed */}
    </Tabs>
  );
};

export default PaneNavigator;
