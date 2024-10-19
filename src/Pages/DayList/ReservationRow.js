import React, { useState, useRef, useEffect } from 'react';
import {
  FaUsers,
  FaEllipsisV,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import './css/reservationRow.css';

const ReservationRow = ({ reservation, activeTab }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = useRef(null);

  const handleMouseEnterIcon = () => {
    // Clear any existing timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeaveIcon = () => {
    // Start timer to hide tooltip after 1.5 seconds
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1500);
  };

  const handleMouseEnterTooltip = () => {
    // Clear timer when entering tooltip
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeaveTooltip = () => {
    // Start timer to hide tooltip after 1.5 seconds
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1500);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

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
        <a href="#" className="name-link">
          {`${reservation.firstName} ${reservation.lastName}`}
        </a>
      </div>
      {activeTab !== 'eenvoudig' && <div>{reservation.email}</div>}
      {activeTab !== 'eenvoudig' && <div>{reservation.phone}</div>}
      <div className="extra-column">
        <div
          className="ellipsis-container"
          onMouseEnter={handleMouseEnterIcon}
          onMouseLeave={handleMouseLeaveIcon}
        >
          <FaEllipsisV className="ellipsis-icon" />
          {showTooltip && (
            <div
              className="tooltip-container"
              onMouseEnter={handleMouseEnterTooltip}
              onMouseLeave={handleMouseLeaveTooltip}
            >
              <div className="tooltip-item">
                <FaPencilAlt className="tooltip-icon" />
                Bewerken
              </div>
              <div className="tooltip-separator"></div>
              <div className="tooltip-item">
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
