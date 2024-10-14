// src/components/NewReservation/MaxGuestMessage.jsx

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './css/maxGuestsMessage.css';

const MaxGuestMessage = ({ maxGuests }) => {
  return (
    <div className="max-guest-message">
      <FaExclamationTriangle className="warning-icon" />
      <p>
        Het aantal gasten is hoger dan het maximum van {maxGuests} voor online
        reservaties. Neem alstublieft telefonisch contact met ons op om uw
        reservatie te maken.
      </p>
    </div>
  );
};

export default MaxGuestMessage;
