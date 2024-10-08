// withHeader.jsx
import React, { useState, useEffect } from 'react';
import './css/style.css';
import './css/mobile.css'

const withHeader = (WrappedComponent) => {
  return (props) => {
    const [title, setTitle] = useState(props.title);


    return (
      <div className="withHeader">
        <div className="header-container">
        <h1
          className="title"
        >
          {title}
        </h1>
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };
