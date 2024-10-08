// Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();

  // Extract pathname and split into segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="breadcrumb">
      <span className="breadcrumb-app">
        <Link to="/" className="breadcrumb-link">
          Mateza Booking
        </Link>
      </span>
      {pathnames.length > 0 && (
        <>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-path">
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              return isLast ? (
                <span key={to} className="breadcrumb-current">
                  {decodeURIComponent(value)}
                </span>
              ) : (
                <span key={to}>
                  <Link to={to} className="breadcrumb-link">
                    {decodeURIComponent(value)}
                  </Link>
                  <span className="breadcrumb-separator">/</span>
                </span>
              );
            })}
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumb;
