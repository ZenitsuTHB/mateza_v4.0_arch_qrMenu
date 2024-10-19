import React, { useEffect, useRef } from 'react';
import {
  FaUsers,
  FaEllipsisV,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
  FaStar,
} from 'react-icons/fa';
import './css/reservationRow.css';

const ReservationRow = ({
  reservation,
  isMobile,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
}) => {
  const tooltipTimerRef = useRef(null);

  const handleIconClick = () => {
    onTooltipToggle(reservation.id);
  };

  // Auto-hide tooltip after 2.5 seconds
  useEffect(() => {
    if (isTooltipOpen) {
      // Clear any existing timer
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
      // Set a new timer to close the tooltip after 2.5 seconds
      tooltipTimerRef.current = setTimeout(() => {
        onTooltipClose();
      }, 2500);
    } else {
      // Clear the timer if the tooltip is not open
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = null;
      }
    }

    // Clean up on unmount
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [isTooltipOpen, onTooltipClose]);

  // Determine if the reservation was created within the last hour
  const now = new Date();
  const createdAt = new Date(reservation.createdAt);
  const diffMs = now - createdAt;
  const isNewReservation = diffMs <= 3600000; // 1 hour in milliseconds

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
      <div className="name-column">
        <a href="#" className="name-link">
          {`${reservation.firstName} ${reservation.lastName}`}
        </a>
        {isNewReservation && (
          <FaStar className="new-user-icon" title="Nieuwe reservering" />
        )}
      </div>
      {!isMobile && <div>{reservation.email}</div>}
      {!isMobile && <div>{reservation.phone}</div>}
      <div className="extra-column">
        <div className="ellipsis-container">
          <FaEllipsisV className="ellipsis-icon" onClick={handleIconClick} />
          {isTooltipOpen && (
            <div className="tooltip-container">
              <div className="tooltip-item">
                <FaPencilAlt className="tooltip-icon" />
                Bewerken
              </div>
              <div className="tooltip-separator"></div>
              <div className="tooltip-item delete-item">
                <FaTrashAlt className="tooltip-icon" />
                Verwijderen
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationRow;
