import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import { motion } from 'framer-motion';
import './css/reservationList.css';
import './css/settingsTabs.css';

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('volledig');
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservationsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reservationsData.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const filteredReservations = currentReservations.map((reservation) => {
    if (activeTab === 'eenvoudig') {
      return {
        aantalGasten: reservation.aantalGasten,
        tijdstip: reservation.tijdstip,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        extra: reservation.extra,
      };
    }
    return reservation;
  });

  return (
    <div className="reservations-page">
      <div className="form-settings-page">
        <div className="tab-menu">
          {['eenvoudig', 'aangepast', 'volledig'].map((tab) => (
            <motion.button
              key={tab}
              type="button"
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="underline-settings-tabs"
                  className="tab-underline"
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="reservations-container">
        <div className={`reservations-grid ${activeTab === 'eenvoudig' ? 'eenvoudig-grid' : ''}`}>
          <div className="reservations-header">
		  <div className="reservation-row">
            <div>#</div>
            <div>Tijdstip</div>
            <div>Naam</div>
            {activeTab !== 'eenvoudig' ? <div>Email</div>: <div></div>}
            {activeTab !== 'eenvoudig' ? <div>Telefoon</div>: <div></div>}
            <div>Extra</div>
          </div>
		  </div>
          {filteredReservations.map((reservation, index) => (
            <ReservationRow key={index} reservation={reservation} />
          ))}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default withHeader(ReservationsList);

