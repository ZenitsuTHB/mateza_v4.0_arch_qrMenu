import { useState } from 'react';
import NotificationPopover from '../../Notification/NotificationPopover';

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const NotificationComponent = () => (
    notification && (
      <NotificationPopover
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    )
  );

  return { triggerNotification, NotificationComponent };
};

export default useNotification;
