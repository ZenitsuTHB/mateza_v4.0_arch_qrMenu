// ReservationNumber.js

import React from 'react';
import { FaUsers } from 'react-icons/fa';
import './css/reservationNumber.css';

const ReservationNumber = ({ aantalGasten }) => {
  return (
    <div className="reservation-number">
      <span>{aantalGasten}</span>
      {aantalGasten >= 5 && aantalGasten < 8 && (
        <FaUsers className="users-icon" />
      )}
      {aantalGasten === 4 && <FaUsers className="users-icon-gray" />}
      {aantalGasten >= 8 && <FaUsers className="users-icon-red" />}
    </div>
  );
};

export default ReservationNumber;
