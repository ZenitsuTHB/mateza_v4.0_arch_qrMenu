// withHeader.jsx
import React, { useState, useEffect } from 'react';
import EditableTitle from './EditableTitle';
import NotificationPopover from './NotificationPopover';
import './css/style.css';

const withHeader = (WrappedComponent) => {
  return (props) => {
    const localStorageKey = `headerTitle_${WrappedComponent.displayName || WrappedComponent.name || 'Component'}`;
    const [title, setTitle] = useState(props.title || 'Default Title');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
      const storedTitle = localStorage.getItem(localStorageKey);
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }, [localStorageKey]);

    useEffect(() => {
      localStorage.setItem(localStorageKey, title);
    }, [localStorageKey, title]);

    useEffect(() => {
      triggerNotification("Nieuwe pagina geopend", "success");
    }, []);

    const triggerNotification = (message, type) => {
      setNotification({ message, type });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    return (
      <div className="withHeader">
        {notification && (
          <NotificationPopover
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="header-container">
          <EditableTitle title={title} setTitle={setTitle} />
        </div>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export { withHeader };
