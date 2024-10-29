import React from 'react';
import TopBar from '../Structural/TopBar';
import SecondaryTopBar from '../Structural/SecondaryTopBar';
import Sidebar from '../Structural/Sidebar';
import ContentRouting from '../Structural/ContentRouting';

const MainApp = () => {
  return (
    <div className="app-component">
      <TopBar />
      <SecondaryTopBar />
      <Sidebar />
      <ContentRouting />
    </div>
  );
};

export default MainApp;
