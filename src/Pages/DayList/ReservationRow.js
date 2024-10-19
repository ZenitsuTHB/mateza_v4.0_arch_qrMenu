import React, { useEffect, useRef } from 'react';
import {
  FaUsers,
  FaEllipsisV,
  FaPencilAlt,
  FaTrashAlt,
  FaUserPlus,
  FaStar,
  FaCircle,
} from 'react-icons/fa';
import './css/reservationRow.css';

const ReservationRow = ({
  reservation,
  isMobile,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
}) => {
  const seenKey = `seen-data-${reservation.id}`;
  const expiryTimeString = localStorage.getItem(seenKey);

  // Function to get current time in CEST
  function getCurrentTimeInCEST() {
    const now = new Date();
    const nowInCESTString = now.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin', // CEST timezone
    });
    return new Date(nowInCESTString);
  }

  let isNewReservationHere = false;

  if (expiryTimeString) {
    const expiryTime = new Date(expiryTimeString);
    const nowInCEST = getCurrentTimeInCEST();
    isNewReservationHere = nowInCEST < expiryTime;
  } else {
    isNewReservationHere = true;
  }

  useEffect(() => {
    if (!expiryTimeString) {
      const nowInCEST = getCurrentTimeInCEST();
      const expiryTime = new Date(nowInCEST.getTime() + 1 * 60 * 1000); // 1 minute from now
      localStorage.setItem(seenKey, expiryTime.toISOString());
    }
  }, [expiryTimeString, seenKey]);

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
        {isNewReservationHere && (
          <FaCircle className="new-user-icon" title="Nieuwe reservering" />
        )}
        <a href="#" className="name-link">
          {`${reservation.firstName} ${reservation.lastName}`}
        </a>
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
