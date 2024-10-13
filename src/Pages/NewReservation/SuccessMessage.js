// src/components/NewReservation/SuccessMessage.jsx

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessMessage = ({ message }) => {
  return (
    <div className="reservation-form">
    <div className="success-message">
      <FaCheckCircle className="success-icon" />
      <p>{message}</p>
    </div>
    </div>
  );
};

export default SuccessMessage;
