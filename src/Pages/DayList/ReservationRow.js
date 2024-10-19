import React from 'react';
import { FaUsers, FaEllipsisV } from 'react-icons/fa';
import './css/reservationRow.css';

const ReservationRow = ({ reservation, activeTab }) => {
  return (
    <div className="reservation-row">
      <div className="reservation-number">
        <strong>{reservation.aantalGasten}</strong>
        {reservation.aantalGasten >= 5 && reservation.aantalGasten < 8 && (
          <FaUsers className="users-icon" />
        )}
        {reservation.aantalGasten === 4 && (
          <FaUsers className="users-icon-gray" />
        )}
        {reservation.aantalGasten >= 8 && (
          <FaUsers className="users-icon-red" />
        )}
      </div>
      <div>{reservation.tijdstip}</div>
      <div>
        <a href="#" className="name-link">{`${reservation.firstName} ${reservation.lastName}`}</a>
      </div>
      {activeTab !== 'eenvoudig' && <div>{reservation.email}</div>}
      {activeTab !== 'eenvoudig' && <div>{reservation.phone}</div>}
      <div className="extra-column">
        <FaEllipsisV className="ellipsis-icon" />
      </div>
    </div>
  );
};

export default ReservationRow;
