// Tooltip.js

import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt, FaStickyNote } from 'react-icons/fa';
import './css/tooltip.css';

const Tooltip = ({
  reservationId,
  extraInfo, // Receive the extra info as a prop
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
}) => {
  const tooltipTimerRef = useRef(null);
  const [isExtraTooltipOpen, setIsExtraTooltipOpen] = useState(false);

  const handleEllipsisClick = () => {
    onTooltipToggle(reservationId);
  };

  const handleExtraIconMouseEnter = () => {
    setIsExtraTooltipOpen(true);
  };

  const handleExtraIconMouseLeave = () => {
    setIsExtraTooltipOpen(false);
  };

  // Auto-hide tooltip after 2.5 seconds for the action tooltip
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

  // Determine if extra info icon should be shown
  const shouldShowExtraIcon = extraInfo && extraInfo.trim() !== '';

  return (
    <div className="extra-column">
      <div className="icons-container">
        {/* Extra Info Icon */}
        {shouldShowExtraIcon && (
          <div
            className="extra-icon-container"
            onMouseEnter={handleExtraIconMouseEnter}
            onMouseLeave={handleExtraIconMouseLeave}
          >
            <FaStickyNote className="extra-icon" />
            {isExtraTooltipOpen && (
              <div className="extra-tooltip">
                {extraInfo}
              </div>
            )}
          </div>
        )}
        {/* Ellipsis Icon */}
        <div className="ellipsis-container">
          <FaEllipsisV className="ellipsis-icon" onClick={handleEllipsisClick} />
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

export default Tooltip;
