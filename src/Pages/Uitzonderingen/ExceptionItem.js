// src/Pages/Uitzonderingen/ExceptionItem.js

import React, { useState } from 'react';
import './css/exceptions.css';
import { FaEllipsisV, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Structural/Modal/Delete';
import EditExceptionModal from './EditExceptionModal';

const ExceptionItem = ({ exception, api, triggerNotification, refreshExceptions }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEllipsisClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
    setIsTooltipOpen(false);
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
    setIsTooltipOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    try {
      await api.delete(`${window.baseDomain}api/uitzonderingen/${exception._id}`);
      triggerNotification('Uitzondering succesvol verwijderd', 'success');
      refreshExceptions();
    } catch (error) {
      console.error('Error deleting exception:', error);
      triggerNotification('Fout bij het verwijderen van de uitzondering', 'error');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div className="exceptions-page__exception-item">
      <div className="exceptions-page__exception-content">
        <h4>{exception.title}</h4>
        <p>Type: {exception.type}</p>
        {exception.type !== 'Sluitingsdag' && <p>Toepassing: {exception.toepassing}</p>}
        <p>
          Geldig van {exception.startDate} tot {exception.endDate}
        </p>
        {(exception.type === 'Opening' || exception.type === 'Uitzondering') && (
          <>
            <p>
              Van {exception.startHour} tot {exception.endHour}
            </p>
            <p>Max. Zitplaatsen: {exception.maxSeats}</p>
          </>
        )}
        <p>Dagen: {exception.daysOfWeek.join(', ')}</p>
      </div>
      <div className="exceptions-page__exception-actions">
        <FaEllipsisV onClick={handleEllipsisClick} className="exceptions-page__ellipsis-icon" />
        {isTooltipOpen && (
          <div className="tooltip-container">
            <div className="tooltip-item" onClick={handleEditClick}>
              <FaPencilAlt className="tooltip-icon" />
              Bewerken
            </div>
            <div className="tooltip-separator"></div>
            <div className="tooltip-item delete-item" onClick={handleDeleteClick}>
              <FaTrashAlt className="tooltip-icon" />
              Verwijderen
            </div>
          </div>
        )}
      </div>
      {isDeleteModalVisible && (
        <ConfirmationModal
          isVisible={isDeleteModalVisible}
          title="Uitzondering Verwijderen"
          message="Weet u zeker dat u deze uitzondering wilt verwijderen?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Verwijderen"
          cancelText="Annuleren"
          confirmButtonClass="discard-button red"
          cancelButtonClass="cancel-button"
        />
      )}
      {isEditModalVisible && (
        <EditExceptionModal
          isVisible={isEditModalVisible}
          exception={exception}
          api={api}
          triggerNotification={triggerNotification}
          refreshExceptions={refreshExceptions}
          onClose={() => setIsEditModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ExceptionItem;
