// src/components/MainApp/MainApp.js

import React from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../Structural/TopBar';
import SecondaryTopBar from '../Structural/SecondaryTopBar';
import Sidebar from '../Structural/Sidebar';
import ContentRouting from '../Structural/ContentRouting';
import routesConfig from '../../Config/sidebarConfig'; // Adjust the path if necessary

const MainApp = () => {
  const location = useLocation();
  const currentRoute = routesConfig.find((route) => route.path === location.pathname);
  const isSidebarHidden = currentRoute ? currentRoute.sidebarHidden : false;

  return (
    <div className={`app-component ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
      <TopBar />
      <SecondaryTopBar />
      {!isSidebarHidden && <Sidebar />}
      <ContentRouting />
    </div>
  );
};

export default MainApp;
