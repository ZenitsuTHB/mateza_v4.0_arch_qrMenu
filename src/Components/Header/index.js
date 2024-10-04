import React, { useState, useEffect } from 'react';
import './header.css';
import { Star } from './star';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const [starred, setStarred] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const toggleStar = () => {
      setStarred(!starred);
      setShowTooltip(true);
      
      // Hide tooltip after 3 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    };

    return (
      <div className="withHeader">
        <h1 className={starred ? "title starred" : "title"}>
          {props.title}
        </h1>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export {withHeader};
