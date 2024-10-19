import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import './css/reservationList.css';
import './css/settingsTabs.css';

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const itemsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      matchesGuests = reservation.aantalGasten
        .toString()
        .includes(guestsSearch);
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
    if (isMobile) {
      // Simplified data for mobile
      return {
        aantalGasten: reservation.aantalGasten,
        tijdstip: reservation.tijdstip,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        extra: reservation.extra,
        id: reservation.id,
      };
    }
    // Full data for desktop
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
            isMobile ? 'eenvoudig-grid' : ''
          }`}
        >
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
            {!isMobile && (
              <div>
                Email
              </div>
            )}
            {!isMobile && (
              <div>
                Telefoon
              </div>
            )}
            <div></div>
          </div>

          {filteredReservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              isMobile={isMobile}
              isTooltipOpen={openTooltipId === reservation.id}
              onTooltipToggle={handleTooltipToggle}
              onTooltipClose={handleTooltipClose}
            />
          ))}
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
};

export default withHeader(ReservationsList);
