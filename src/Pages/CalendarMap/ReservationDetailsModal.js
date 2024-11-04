// ReservationDetailsModal.js

import React from 'react';
import './css/reservationsDetailModal.css';

const ReservationDetailsModal = ({ reservationsData, onClose }) => {
  const { date, reservations } = reservationsData;

  return (
    <div className="reservation-modal-overlay">
      <div className="reservation-modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Reservations for {date}</h2>
        <div className="reservation-table">
          {reservations.map((reservation, index) => (
            <div key={index} className="reservation-row">
              <div className="reservation-main-info">
                <strong>{reservation.aantalGasten} guests - {reservation.time} - {reservation.fullName}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;
