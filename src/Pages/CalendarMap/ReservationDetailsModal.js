// ReservationDetailsModal.js

import React, { useState } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard/index.js'; // Adjust the import path as needed
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import './css/reservationsDetailModal.css';

const ReservationDetailsModal = ({ reservationsData, onClose }) => {
  const { date, reservations } = reservationsData;

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="reservation-modal-content">
          <h2>Reserveringen voor {date}</h2>
          <div className="reservation-table">
            {reservations.map((reservation, index) => (
              <ReservationRow key={index} reservation={reservation} />
            ))}
          </div>
        </div>
      }
    />
  );
};

const ReservationRow = ({ reservation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="reservation-row">
      <div className="reservation-main-info" onClick={() => setIsExpanded(!isExpanded)}>
        <FaChevronDown className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
        <strong>{reservation.aantalGasten} gasten - {reservation.time} - {reservation.fullName}</strong>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="reservation-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>Email: {reservation.email}</div>
            <div>Telefoon: {reservation.phone}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationDetailsModal;
