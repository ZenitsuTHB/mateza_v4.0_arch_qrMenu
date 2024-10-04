// Routing/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routesConfig from './config.js';

const Routing = () => {
  return (
    <Routes>
      {routesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Routing;
