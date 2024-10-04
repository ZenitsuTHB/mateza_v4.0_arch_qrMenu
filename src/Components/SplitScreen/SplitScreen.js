// Components/SplitScreen/SplitScreen.js
import React from 'react';
import SplitPane from 'react-split-pane';
import './SplitScreen.css';

const SplitScreen = ({ left, right }) => {
  return (
    <SplitPane split="vertical" minSize={100} defaultSize="50%">
      <div className="withHeader">
        {left}
      </div>
      <div className="withHeader">
        {right}
      </div>
    </SplitPane>
  );
};

export default SplitScreen;
