// Components/SplitScreen/SplitScreen.js
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import './SplitScreen.css';
import PaneNavigator from '../PaneNavigator/PaneNavigator.js';

const SplitScreen = ({ left }) => {
  const [leftPaneSize, setLeftPaneSize] = useState('50%');

  const onDragFinished = (size) => {
    setLeftPaneSize(size);
  };

  const isLeftPaneCollapsed = leftPaneSize <= 0 || leftPaneSize === '0%';

  return (
    <div className="split-screen">
      <SplitPane
        split="vertical"
        minSize={0}
        maxSize={-1}
        defaultSize="50%"
        onChange={(size) => setLeftPaneSize(size)}
        onDragFinished={onDragFinished}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <div className={`${isLeftPaneCollapsed ? 'collapsed' : ''}`}>
          {!isLeftPaneCollapsed && left}
        </div>
          <PaneNavigator/>
      </SplitPane>
    </div>
  );
};

export default SplitScreen;
