// src/Components/RightPane/RightPane.js
import React from 'react';
import PaneNavigator from '../PaneNavigator/PaneNavigator';

const RightPane = ({
  tabs,
  setTabs,
  selectedIndex,
  setSelectedIndex,
  closeTab,
}) => (
  <PaneNavigator
    tabs={tabs}
    setTabs={setTabs}
    selectedIndex={selectedIndex}
    setSelectedIndex={setSelectedIndex}
    closeTab={closeTab}
  />
);

export default RightPane;
