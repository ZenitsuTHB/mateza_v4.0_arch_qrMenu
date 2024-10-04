// Components/PaneNavigator/PaneNavigator.js
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Home from '../../Pages/Home/index.js';
import About from '../../Pages/About/index.js';

import './PaneNavigator.css'

const PaneNavigator = () => {
  return (
    <Tabs className="paneNavigator">
      <TabList>
        <Tab>Home</Tab>
        <Tab>About</Tab>
      </TabList>

      <TabPanel>
        <Home title="Home" />
      </TabPanel>
      <TabPanel>
        <About title="About" />
      </TabPanel>
    </Tabs>
  );
};

export default PaneNavigator;
