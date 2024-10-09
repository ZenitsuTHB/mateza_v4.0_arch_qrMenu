import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import routesConfig from '../../../config'; // Adjust the relative path as needed
import './css/secondaryTopBar.css'; // Import the CSS file

const SecondaryTopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activePath, setActivePath] = useState(null);

  // Function to find the matching route configuration
  const findCurrentRoute = () => {
    // Sort routes by path length in descending order to match the most specific route first
    const sortedRoutes = [...routesConfig].sort((a, b) => b.path.length - a.path.length);
    return sortedRoutes.find(route => currentPath.startsWith(route.path));
  };

  const currentRoute = findCurrentRoute();
  const secondaryTopBarConfig = currentRoute?.secondaryTopBar || [];

  useEffect(() => {
    // Set the first button's path as the default active path if no activePath is selected
    if (!activePath && secondaryTopBarConfig.length > 0) {
      setActivePath(secondaryTopBarConfig[0].path);
      navigate(secondaryTopBarConfig[0].path); // Automatically navigate to the first button's path
    }
  }, [secondaryTopBarConfig, activePath, navigate]);

  // If there's no secondaryTopBar configuration for the current route, don't render the component
  if (secondaryTopBarConfig.length === 0) {
    return null;
  }

  const handleNavigation = (path) => {
    setActivePath(path); // Set the active button
    navigate(path); // Programmatically navigate to the desired path
  };

  return (
    <div className="secondary-top-bar">
      <div className="buttons-container">
        {secondaryTopBarConfig.map((button) => (
          <button
            key={button.path}
            className={clsx('secondary-button', {
              'active': activePath === button.path,
            })}
            onClick={() => handleNavigation(button.path)}
            aria-label={button.label}
          >
            {button.label}
            <div className="underline" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SecondaryTopBar;
