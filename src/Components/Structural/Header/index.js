import React from 'react';
import './css/style.css';
import './css/mobile.css'
import Breadcrumb from './BreadCrumb';

const withHeader = (WrappedComponent) => {
  return (props) => {
    return (
      <div className="withHeader">
        <h1 className="title">{props.title}</h1>
        <Breadcrumb/>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };
