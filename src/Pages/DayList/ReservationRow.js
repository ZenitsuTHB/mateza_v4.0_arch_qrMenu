// src/components/ReservationsList/ReservationRow.jsx

import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { FaUsers } from 'react-icons/fa';
import './css/reservationRow.css';

const ReservationRow = ({ reservation }) => {
  const [showNoteTooltip, setShowNoteTooltip] = useState(false);
  const [showMenuTooltip, setShowMenuTooltip] = useState(false);

  return (
    <div className="reservation-row">
      <div>
        <strong>{reservation.aantalGasten}</strong>
        {reservation.aantalGasten >= 5 && (
			<FaUsers style={{ color: 'lightgray', marginLeft: '5px' }}/>
        )}
      </div>
      <div>{reservation.tijdstip}</div>
      <div>
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
