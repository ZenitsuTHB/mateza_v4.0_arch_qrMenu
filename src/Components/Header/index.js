import React from 'react';
import './header.css'

const withHeader = (WrappedComponent) => {
  return (props) => {

    return (
      <div className='withHeader'>
        <h1>{props.title}</h1>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };