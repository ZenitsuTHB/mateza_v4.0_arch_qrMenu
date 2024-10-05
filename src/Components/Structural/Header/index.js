import React from 'react';
import './css/style.css';

const withHeader = (WrappedComponent) => {
  return (props) => {
    return (
      <div className="withHeader">
        <h1 className="title">
          {props.title}
        </h1>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export {withHeader};
