// Tooltip.js

import React, { useEffect, useRef } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import '../css/tooltip.css';

const Tooltip = ({
  reservationId,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
}) => {
  const tooltipTimerRef = useRef(null);

  const handleIconClick = () => {
    onTooltipToggle(reservationId);
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
  );
};

export default Tooltip;
