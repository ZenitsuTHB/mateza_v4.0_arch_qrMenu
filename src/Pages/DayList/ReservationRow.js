// src/components/ReservationsList/ReservationRow.jsx

import React, { useState } from 'react';
import ProfilePhoto from './ProfilePhoto';
import Tooltip from './Tooltip';
import './css/reservationRow.css';

const ReservationRow = ({ reservation }) => {
  const [showNoteTooltip, setShowNoteTooltip] = useState(false);
  const [showMenuTooltip, setShowMenuTooltip] = useState(false);

  const initials =
    reservation.firstName.charAt(0).toUpperCase() +
    reservation.lastName.charAt(0).toUpperCase();

  return (
    <div className="reservation-row">
      <div>{reservation.aantalGasten}</div>
      <div>{reservation.tijdstip}</div>
      <div className="profile-name">
        <ProfilePhoto initials={initials} />
        <a href="#" className="name-link">{`${reservation.firstName} ${reservation.lastName}`}</a>
      </div>
      <div>{reservation.email}</div>
      <div>{reservation.phone}</div>
      <div className="extra-actions">
        {reservation.extra && (
          <div
            className="note-icon"
            onMouseEnter={() => setShowNoteTooltip(true)}
            onMouseLeave={() => setShowNoteTooltip(false)}
          >
            <i className="fa fa-sticky-note-o"></i>
            {showNoteTooltip && (
              <Tooltip>
                <div className="tooltip-content">{reservation.extra}</div>
              </Tooltip>
            )}
          </div>
        )}
        <div
          className="menu-icon"
          onClick={() => setShowMenuTooltip(!showMenuTooltip)}
        >
          <i className="fa fa-ellipsis-v"></i>
          {showMenuTooltip && (
            <Tooltip>
              <div className="tooltip-item">
                <i className="fa fa-edit"></i>
                Bewerk
              </div>
              <div className="tooltip-separator"></div>
              <div className="tooltip-item delete">
                <i className="fa fa-trash"></i>
                Verwijder
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationRow;
