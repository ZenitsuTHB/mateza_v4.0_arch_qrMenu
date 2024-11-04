// ReservationDetailsModal.js

import React, { useState } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard'; // Adjust the import path as needed
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import './css/reservationDetailsModal.css';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const ReservationDetailsModal = ({ reservationsData, onClose }) => {
  const { date, reservations } = reservationsData;
  const formattedDate = format(new Date(date), 'd MMMM yyyy', { locale: nl });

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="reservation-modal-content">
          <h2>Reservaties - {formattedDate}</h2>
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
        <span>
          <strong>{reservation.aantalGasten} gasten - {reservation.time}</strong> - {reservation.fullName}
        </span>
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
            {reservation.extra && <div>Extra: {reservation.extra}</div>}
            <div className="reservation-buttons">
              <button className="standard-button red">Verwijderen</button>
              <button className="standard-button blue">Bewerken</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationDetailsModal;
