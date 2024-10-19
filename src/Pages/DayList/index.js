import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import './css/reservationList.css';
import './css/settingsTabs.css';
import TabBar from './TabBar.js';

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('volledig');
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservationsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  const handleTooltipToggle = (id) => {
    if (openTooltipId === id) {
      // If the tooltip is already open for this id, close it
      setOpenTooltipId(null);
    } else {
      // Open the tooltip for this id
      setOpenTooltipId(id);
    }
  };

  const handleTooltipClose = () => {
    setOpenTooltipId(null);
  };

  const filteredReservations = currentReservations.map((reservation) => {
    if (activeTab === 'eenvoudig') {
      return {
        aantalGasten: reservation.aantalGasten,
        tijdstip: reservation.tijdstip,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        extra: reservation.extra,
        id: reservation.id,
      };
    }
    return reservation;
  });

  return (
    <div className="reservations-page">
      <TabBar activeTab={activeTab} handleTabClick={handleTabClick} />
      <div className="reservations-container">
        <div
          className={`reservations-grid ${
            activeTab === 'eenvoudig' ? 'eenvoudig-grid' : ''
          }`}
        >
          <div className="reservations-header">
            <div className="reservation-row">
              <div>#</div>
              <div>Tijdstip</div>
              <div>Naam</div>
              {activeTab !== 'eenvoudig' && <div>Email</div>}
              {activeTab !== 'eenvoudig' && <div>Telefoon</div>}
              <div></div> {/* Empty header for the extra column */}
            </div>
          </div>

          {filteredReservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              activeTab={activeTab}
              isTooltipOpen={openTooltipId === reservation.id}
              onTooltipToggle={handleTooltipToggle}
              onTooltipClose={handleTooltipClose}
            />
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
