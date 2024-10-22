// src/Components/Notification/NotificationPopover.jsx

import React, { useRef } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import './css/notification.css';

const NotificationPopover = ({ message, type }) => {
  const popoverRef = useRef(null);

  const getIconAndColor = (type) => {
    switch (type) {
      case 'success':
        return { icon: <FaCheckCircle />, color: '#4CAF50' }; // Green
      case 'error':
        return { icon: <FaTimesCircle />, color: '#f44336' }; // Red
      case 'warning':
        return { icon: <FaExclamationTriangle />, color: '#FFA500' }; // Orange
      default:
        return { icon: <FaCheckCircle />, color: '#4CAF50' }; // Default to success
    }
  };

  const { icon, color } = getIconAndColor(type);

  return (
    <div ref={popoverRef} className={`notification-popover ${type}`}>
      <div
        className="notification-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <span className="notification-message">{message}</span>
    </div>
  );
};

export default NotificationPopover;
