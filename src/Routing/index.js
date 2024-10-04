// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routesConfig from './config.js';

const Routing = () => {
  return (
      <Routes>
        {routesConfig.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={React.cloneElement(route.element, { title: route.label })}
          >
            {route.children &&
              route.children.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={React.cloneElement(child.element, { title: child.label })}
                />
              ))}
          </Route>
        ))}
      </Routes>
  );
};

export default Routing;
