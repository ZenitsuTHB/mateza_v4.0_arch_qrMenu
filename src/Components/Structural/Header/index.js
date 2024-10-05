import React, { useState, useEffect } from 'react';
import EditableTitle from './EditableTitle';
import './css/style.css';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const localStorageKey = `headerTitle_${WrappedComponent.name}`;
    const [title, setTitle] = useState(props.title);

    useEffect(() => {
      const storedTitle = localStorage.getItem(localStorageKey);
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }, [localStorageKey]);

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