import React, { useState } from 'react';
import './header.css';
import { Star } from './star';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const [starred, setStarred] = useState(false);

    const toggleStar = () => {
      setStarred(!starred);
    };

    return (
      <div className="withHeader">
        <h1 className={starred ? "title starred" : "title"}>
          {props.title}
          <Star starred={starred} toggleStar={toggleStar} />
        </h1>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export {withHeader};
