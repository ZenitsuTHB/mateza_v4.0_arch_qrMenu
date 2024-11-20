// Tooltip.js

import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt, FaStickyNote } from 'react-icons/fa';
import './css/tooltip.css';

const Tooltip = ({
  reservationId,
  extraInfo,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
}) => {
  const tooltipTimerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isParentHovered, setIsParentHovered] = useState(false);
  const [isEllipsisHovered, setIsEllipsisHovered] = useState(false);

  const handleEllipsisClick = () => {
    onTooltipToggle(reservationId);
  };

  const handleExtraIconMouseEnter = () => {
    setIsIconHovered(true);
  };

  const handleExtraIconMouseLeave = () => {
    setIsIconHovered(false);
  };

  useEffect(() => {
    if (isTooltipOpen) {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
      tooltipTimerRef.current = setTimeout(() => {
        onTooltipClose();
      }, 2500);
    } else {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = null;
      }
    }

    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [isTooltipOpen, onTooltipClose]);

  useEffect(() => {
    const currentTooltip = tooltipRef.current;
    if (!currentTooltip) return;

    const parentElement = currentTooltip.parentElement;
    if (!parentElement) return;

    const handleParentMouseEnter = () => {
      setIsParentHovered(true);
    };

    const handleParentMouseLeave = () => {
      setIsParentHovered(false);
    };

    parentElement.addEventListener('mouseenter', handleParentMouseEnter);
    parentElement.addEventListener('mouseleave', handleParentMouseLeave);

    return () => {
      parentElement.removeEventListener('mouseenter', handleParentMouseEnter);
      parentElement.removeEventListener('mouseleave', handleParentMouseLeave);
    };
  }, []);

  const shouldShowExtraIcon = extraInfo && extraInfo.trim() !== '';

  const isExtraTooltipOpen = (isIconHovered || isParentHovered) && !isTooltipOpen && !isEllipsisHovered;

  return (
    <div className="extra-column" ref={tooltipRef}>
      <div className="icons-container">
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
        <div
          className="ellipsis-container"
          onMouseEnter={() => setIsEllipsisHovered(true)}
          onMouseLeave={() => setIsEllipsisHovered(false)}
        >
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
