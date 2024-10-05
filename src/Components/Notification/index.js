// src/hooks/useNotification.js
import { useState } from 'react';
import NotificationPopover from './NotificationPopover';

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const triggerNotification = (message, type) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [...prevNotifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
    }, 3000);
  };

  const NotificationComponent = () => (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationPopover
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );

  return { triggerNotification, NotificationComponent };
};

export default useNotification;
