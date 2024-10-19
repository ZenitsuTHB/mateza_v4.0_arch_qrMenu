// ReservationRow.js

import React, { useEffect } from 'react';
import ReservationNumber from './ReservationNumber.js';
import NameColumn from './NameColumn.js';
import Tooltip from './TooltipView.js';
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
      const expiryTime = new Date(nowInCEST.getTime() + 60 * 60 * 1000); // 60 minutes from now
      localStorage.setItem(seenKey, expiryTime.toISOString());
    }
  }, [expiryTimeString, seenKey]);

  if (isMobile) {
    return (
      <div className="reservation-row-mobile">
        <div className="reservation-item">
          <div className="label">Aantal Gasten</div>
          <ReservationNumber aantalGasten={reservation.aantalGasten} />
        </div>
        <div className="reservation-item">
          <div className="label">Tijdstip</div>
          <div>{reservation.tijdstip}</div>
        </div>
        <div className="reservation-item">
          <div className="label">Naam</div>
          <NameColumn
            isNewReservationHere={isNewReservationHere}
            firstName={reservation.firstName}
            lastName={reservation.lastName}
          />
        </div>
        <div className="reservation-item">
          <div className="label">Email</div>
          <div>{reservation.email}</div>
        </div>
        <div className="reservation-item">
          <div className="label">Telefoon</div>
          <div>{reservation.phone}</div>
        </div>
        <div className="reservation-item">
          <div className="label">Extra</div>
          <div>{reservation.extra}</div>
        </div>
        <div className="reservation-item buttons-container">
          <button className="edit-button">Bewerk</button>
          <button className="delete-button">Verwijderen</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="reservation-row">
        <ReservationNumber aantalGasten={reservation.aantalGasten} />
        <div>{reservation.tijdstip}</div>
        <NameColumn
          isNewReservationHere={isNewReservationHere}
          firstName={reservation.firstName}
          lastName={reservation.lastName}
        />
        <div>{reservation.email}</div>
        <div>{reservation.phone}</div>
        <Tooltip
          reservationId={reservation.id}
          isTooltipOpen={isTooltipOpen}
          onTooltipToggle={onTooltipToggle}
          onTooltipClose={onTooltipClose}
        />
      </div>
    );
  }
};

export default ReservationRow;
