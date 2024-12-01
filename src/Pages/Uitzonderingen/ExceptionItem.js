// src/Pages/Uitzonderingen/ExceptionItem.js

import React, { useState } from 'react';
import './css/exceptions.css';
import { FaEllipsisV, FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../Components/Structural/Modal/Delete';

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

  // Determine the color class based on the type
  const typeColorClass = () => {
    switch (exception.type) {
      case 'Opening':
        return 'tag-green';
      case 'Uitzondering':
        return 'tag-blue';
      case 'Sluitingsdag':
        return 'tag-orange';
      default:
        return '';
    }
  };

  return (
    <div className="exceptions-page__exception-item">
      <div className="exceptions-page__exception-content">
        <h4>
          {exception.title}{' '}
          <span className={`exceptions-page__tag ${typeColorClass()}`}>{exception.type}</span>
        </h4>
        {exception.type !== 'Sluitingsdag' && exception.toepassing && (
          <p>Toepassing: {exception.toepassing}</p>
        )}
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
    </div>
  );
};

export default ExceptionItem;
