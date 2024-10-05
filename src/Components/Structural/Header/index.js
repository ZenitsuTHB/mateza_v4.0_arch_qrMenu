import React, { useState, useEffect } from 'react';
import EditableTitle from './EditableTitle';
import NotificationPopover from './NotificationPopover';
import './css/style.css';

let triggerNotification;

const withHeader = (WrappedComponent) => {
  return (props) => {
    const localStorageKey = `headerTitle_${WrappedComponent.name}`;
    const [title, setTitle] = useState(props.title);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
      const storedTitle = localStorage.getItem(localStorageKey);
      if (storedTitle) {
        setTitle(storedTitle);
      }
    }, [localStorageKey]);

    useEffect(() => {
      triggerNotification("Nieuwe pagina geopend", "success");
    }, []);

    triggerNotification = (message, type) => {
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