// Routing/index.js (or Content/index.js)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routesConfig from './config.js';

const Content = () => {
  return (
    <div className="content">
      <Routes>
        {routesConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
};

export default Content;
