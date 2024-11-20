// Tooltip.js

import React, { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt, FaStickyNote, FaBirthdayCake } from 'react-icons/fa';
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

  // List of words to check for birthday or anniversary in 5 languages
  const birthdayWords = [
    'birthday', 'anniversary',           // English
    'anniversaire',                      // French
    'geburtstag', 'jahrestag',           // German
    'jarig', 'verjaardag', 'jubileum',   // Dutch
    'cumpleaños', 'aniversario',         // Spanish
  ];

  let iconToUse = FaStickyNote;

  if (shouldShowExtraIcon) {
    const extraInfoLower = extraInfo.toLowerCase();
    const containsBirthdayWord = birthdayWords.some(word => extraInfoLower.includes(word));

    if (containsBirthdayWord) {
      iconToUse = FaBirthdayCake;
    }
  }

  // Construct the external URL with reservationId
  const editUrl = `https://view.reservaties.net/?action=edit&reservationId=${encodeURIComponent(reservationId)}`;
  const deleteUrl = `https://view.reservaties.net/?action=delete&reservationId=${encodeURIComponent(reservationId)}`;

  return (
    <div className="extra-column" ref={tooltipRef}>
      <div className="icons-container">
        {shouldShowExtraIcon && (
          <div
            className="extra-icon-container"
            onMouseEnter={handleExtraIconMouseEnter}
            onMouseLeave={handleExtraIconMouseLeave}
          >
            {React.createElement(iconToUse, { className: 'extra-icon' })}
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
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tooltip-item no-style"
              >
                <FaPencilAlt className="tooltip-icon" />
                Bewerken
              </a>
              <div className="tooltip-separator"></div>
              <a
                href={deleteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tooltip-item delete-item no-style"
              >
                <FaTrashAlt className="tooltip-icon" />
                Verwijderen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
