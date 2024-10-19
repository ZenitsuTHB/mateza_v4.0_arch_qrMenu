import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import './css/reservationList.css';
import './css/settingsTabs.css';
import TabBar from './TabBar.js';
import {
	FaHashtag,
	FaClock,
	FaUser,
	FaEnvelope,
	FaPhone,
  } from 'react-icons/fa';
  

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('volledig');
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const itemsPerPage = 10;

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
      setOpenTooltipId(null);
    } else {
      setOpenTooltipId(id);
    }
  };

  const handleTooltipClose = () => {
    setOpenTooltipId(null);
  };

  // Filter reservationsData based on search terms
  const filteredReservationsData = reservationsData.filter((reservation) => {
    let matchesName = true;
    let matchesGuests = true;
    let matchesTime = true;

    if (nameSearch) {
      const fullName = `${reservation.firstName} ${reservation.lastName}`.toLowerCase();
      matchesName = fullName.includes(nameSearch.toLowerCase());
    }

    if (guestsSearch) {
      matchesGuests = reservation.aantalGasten.toString().includes(guestsSearch);
    }

    if (timeSearch) {
      matchesTime = reservation.tijdstip.includes(timeSearch);
    }

    return matchesName && matchesGuests && matchesTime;
  });

  const totalPages = Math.ceil(filteredReservationsData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservationsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

      {/* Search Bars */}
      <div className="search-bars-container">
        <input
          type="text"
          placeholder="Zoeken op naam"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="Zoeken op gasten..."
          value={guestsSearch}
          onChange={(e) => setGuestsSearch(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="Zoeken op uur"
          value={timeSearch}
          onChange={(e) => setTimeSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="reservations-container">
        <div
          className={`reservations-grid ${
            activeTab === 'eenvoudig' ? 'eenvoudig-grid' : ''
          }`}
        >
          <div className="reservations-header reservation-row">
            <div className="reservations-header reservation-row">
  <div>
	#
  </div>
  <div>
	Uur
  </div>
  <div>
    Naam
  </div>
  {activeTab !== 'eenvoudig' && (
    <div>
      Email
    </div>
  )}
  {activeTab !== 'eenvoudig' && (
    <div>
      Telefoon
    </div>
  )}
  <div></div>
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
