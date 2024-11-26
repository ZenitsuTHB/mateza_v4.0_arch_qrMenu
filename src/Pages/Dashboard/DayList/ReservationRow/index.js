// ReservationRow.js

import React, { useEffect, useState } from 'react';
import ReservationNumber from './ReservationNumber.js';
import NameColumn from './NameColumn.js';
import Tooltip from './TooltipView.js';
import ConfirmationModal from '../../../../Components/Structural/Modal/Delete';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import './css/reservationRow.css';
import './css/mobile.css';
import useApi from '../../../../Hooks/useApi';

const ReservationRow = ({
  reservation,
  isMobile,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
  triggerNotification, // Receive triggerNotification via props
}) => {
  const seenKey = `seen-data-${reservation.id}`;
  const expiryTimeString = localStorage.getItem(seenKey);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // New state for visibility

  const api = useApi();

  function getCurrentTimeInCEST() {
    const now = new Date();
    const nowInCESTString = now.toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
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

  // Internal handler for deletion success
  const handleDeleteSuccess = (deletedReservationId) => {
    if (deletedReservationId === reservation.id) {
      setIsVisible(false); // Hide the row
      // Trigger a success notification
      triggerNotification('Reservatie verwijderd', 'success');
    }
    // If you need to notify a parent component, you can add that logic here
  };

  // Handler for opening the delete confirmation modal
  const handleDeleteClick = () => {
    setDeleteError(null);
    setIsDeleteModalVisible(true);
  };

  // Handler for confirming deletion
  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await api.delete(`${window.baseDomain}api/auth-reservations/${reservation.id}`);
      handleDeleteSuccess(reservation.id); // Use internal handler
      console.log(`Reservation ${reservation.id} has been deleted.`);
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setDeleteError(
        error.response?.data?.error || error.message || 'Failed to delete the reservation.'
      );
      // Optionally, trigger an error notification
      triggerNotification('Fout bij het verwijderen van de reservatie.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for canceling deletion
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Handler for editing reservation
  const handleEditClick = () => {
    const editUrl = `https://view.reservaties.net/?action=edit&reservationId=${encodeURIComponent(
      reservation.id
    )}&admin=true`;
    window.open(editUrl, '_blank');
  };

  if (!isVisible) {
    return null; // Do not render the row if it's not visible
  }

  return (
    <>
      {isMobile ? (
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
            <div className="label">Extra Info / Allergenen</div>
            <div>{reservation.extra || 'Geen extra info'}</div>
          </div>
          <div className="reservation-item buttons-container">
            <button className="edit-button" onClick={handleEditClick}>
              <FaPencilAlt className="button-icon" />
              Bewerk
            </button>
            <button className="delete-button" onClick={handleDeleteClick}>
              <FaTrashAlt className="button-icon" />
              Verwijderen
            </button>
          </div>

          <ConfirmationModal
            isVisible={isDeleteModalVisible}
            title="Reservatie Verwijderen"
            message="Wilt u deze reservatie verwijderen?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            confirmText="Verwijderen"
            cancelText="Annuleren"
            confirmButtonClass="discard-button red"
            cancelButtonClass="cancel-button"
            isLoading={isDeleting}
            errorMessage={deleteError}
          />
        </div>
      ) : (
        <div className="reservation-row reservation-row-desktop">
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
            extraInfo={reservation.extra}
            isTooltipOpen={isTooltipOpen}
            onTooltipToggle={onTooltipToggle}
            onTooltipClose={onTooltipClose}
            onDeleteSuccess={handleDeleteSuccess} // Pass internal handler
          />
        </div>
      )}
    </>
  );
};

export default ReservationRow;
