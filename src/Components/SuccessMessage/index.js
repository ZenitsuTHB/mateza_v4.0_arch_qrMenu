import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './css/successMessage.css'; // If you need specific styles for this component

const SuccessMessage = ({ message }) => {
  return (
    <div className="success-message">
      <FaCheckCircle className="success-icon" />
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
