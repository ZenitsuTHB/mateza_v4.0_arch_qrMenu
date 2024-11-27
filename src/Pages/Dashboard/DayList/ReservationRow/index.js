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


const FIELD_CONFIG = [
  { key: 'aantalGasten', label: 'Aantal Gasten', alwaysVisible: true },
  { key: 'tijdstip', label: 'Tijdstip', alwaysVisible: true },
  { key: 'fullName', label: 'Naam', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'phone', label: 'Telefoon', defaultVisible: true },
  { key: 'extra', label: 'Extra Informatie', defaultVisible: false },
  { key: 'language', label: 'Taal', defaultVisible: false },
  { key: 'menu', label: 'Menu', defaultVisible: false },
  { key: 'createdAt', label: 'Aangemaakt Op', defaultVisible: false },
  { key: 'actions', label: '', alwaysVisible: true }, // For actions
];

const ReservationRow = ({
  reservation,
  visibleFields,
  isMobile,
  isTooltipOpen,
  onTooltipToggle,
  onTooltipClose,
  triggerNotification,
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

  const renderField = (reservation, fieldKey) => {
    switch (fieldKey) {
      case 'aantalGasten':
        return <ReservationNumber aantalGasten={reservation.aantalGasten} />;
      case 'tijdstip':
        return reservation.tijdstip;
      case 'fullName':
        return (
          <NameColumn
            isNewReservationHere={isNewReservationHere}
            firstName={reservation.firstName}
            lastName={reservation.lastName}
          />
        );
      case 'email':
        return reservation.email;
      case 'phone':
        return reservation.phone;
      case 'extra':
        if (isMobile) {
          return reservation.extra || 'Geen extra info';
        } else {
          return reservation.extra || 'Geen extra info';
        }
      case 'language':
        return reservation.language;
      case 'menu':
        return reservation.menu;
      case 'createdAt':
        return new Date(reservation.createdAt).toLocaleString();
      case 'actions':
        return (
          <div className="actions-cell">
            <button className="edit-button" onClick={handleEditClick}>
              <FaPencilAlt className="button-icon" />
            </button>
            <button className="delete-button" onClick={handleDeleteClick}>
              <FaTrashAlt className="button-icon" />
            </button>

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
        );
      default:
        return reservation[fieldKey];
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="reservation-row-mobile">
          {visibleFields.map((fieldKey) => (
            <div key={fieldKey} className="reservation-item">
              <div className="label">{FIELD_CONFIG.find((field) => field.key === fieldKey).label}</div>
              <div>{renderField(reservation, fieldKey)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="reservation-row reservation-row-desktop">
          {visibleFields.map((fieldKey) => (
            <div key={fieldKey}>{renderField(reservation, fieldKey)}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default ReservationRow;
