// withHeader.jsx
import React, { useState, useEffect } from 'react';
import EditableTitle from './EditableTitle';
import './css/style.css';
import './css/mobile.css'

const withHeader = (WrappedComponent) => {
  return (props) => {
    const localStorageKey = `headerTitle_${WrappedComponent.displayName || WrappedComponent.name || 'Component'}`;
    const [title, setTitle] = useState(props.title || 'Default Title');

    useEffect(() => {
      const storedTitle = localStorage.getItem(localStorageKey);
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }, [localStorageKey]);

    useEffect(() => {
      localStorage.setItem(localStorageKey, title);
    }, [localStorageKey, title]);

    return (
      <div className="withHeader">
        <div className="header-container">
          <EditableTitle title={title} setTitle={setTitle} />
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };
