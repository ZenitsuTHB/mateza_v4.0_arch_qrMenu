// Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/breadcrumb.css';
import routesConfig from '../../../Config/sidebarConfig'; // Adjust the import path accordingly

/**
 * Utility function to recursively find a route by its path.
 * @param {string} path - The path to search for.
 * @param {Array} routes - The routes configuration array.
 * @returns {object|null} - The matched route object or null if not found.
 */
const findRoute = (path, routes) => {
  for (const route of routes) {
    // Normalize the route path by removing trailing slashes
    const normalizedRoutePath = route.path.replace(/\/+$/, '');
    if (normalizedRoutePath === path) {
      return route;
    }
    // If the route has nested children, search recursively
    if (route.children) {
      const found = findRoute(path, route.children);
      if (found) return found;
    }
  }
  return null;
};

const Breadcrumb = () => {
  const location = useLocation(); // Get current location
  const pathnames = location.pathname.split('/').filter((x) => x); // Split path into segments

  // Map each path segment to its corresponding breadcrumb item
  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`; // Construct the path up to the current segment
    const route = findRoute(to, routesConfig); // Find the route configuration
    return {
      label: route ? route.label : decodeURIComponent(value), // Use route label or decoded segment
      path: to,
    };
  });

  let displayedBreadcrumbs = [];

  if (breadcrumbs.length === 0) {
    // If on the root path, show only the root breadcrumb
    displayedBreadcrumbs = [
      {
        label: 'Mateza Booking',
        path: '/',
      },
    ];
  } else if (breadcrumbs.length === 1) {
    // If on a single segment path, show root + that segment
    displayedBreadcrumbs = [
      {
        label: 'Mateza Booking',
        path: '/',
      },
      breadcrumbs[0],
    ];
  } else {
    // If on a multi-segment path, show only the last two segments
    displayedBreadcrumbs = breadcrumbs.slice(-2);
  }

  return (
    <div className="breadcrumb-component">
      <nav className="breadcrumb" aria-label="breadcrumb">
        {displayedBreadcrumbs.map((crumb, index) => {
          const isLast = index === displayedBreadcrumbs.length - 1; // Check if it's the last breadcrumb
          const isFirst = index === 0; // Check if it's the first breadcrumb

          return (
            <span key={crumb.path} className="breadcrumb-item">
              {!isLast ? (
                <>
                  <Link
                    to={crumb.path}
                    className={`breadcrumb-link ${isFirst ? 'breadcrumb-link-blue' : ''}`}
                  >
                    {crumb.label}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;
