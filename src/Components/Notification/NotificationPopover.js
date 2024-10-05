import React, { useRef } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import './css/notification.css';

const NotificationPopover = ({ message, type }) => {
  const popoverRef = useRef(null);
  const icon = type === "success" ? <FaCheckCircle /> : <FaTimes />;

  return (
    <div ref={popoverRef} className="notification-popover">
      <div
        className="notification-icon"
        style={{ backgroundColor: type === "success" ? "#4CAF50" : "#f44336" }}
      >
        {icon}
      </div>
      <span className="notification-message">{message}</span>
    </div>
  );
};

export default NotificationPopover;