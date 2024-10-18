// src/components/ReservationsList/ReservationsList.jsx

import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import './css/reservationList.css';

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  return (
    <div className="reservations-page">
      <div className="reservations-container">
        <div className="reservations-grid">
          <div className="reservations-header">
            <div>#</div>
            <div>Tijdstip</div>
            <div>Volledige Naam</div>
            <div>Email</div>
            <div>Telefoon</div>
            <div>Extra</div>
          </div>
          {currentReservations.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} />
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
