// ReservationsList.js

import React, { useState, useContext, useMemo } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../Context/SearchContext.js';
import './css/reservationList.css';
import './css/settingsTabs.css';

import useIsMobile from './Hooks/useIsMobile.js';
import useFilteredReservations from './Hooks/useFilteredReservations.js';
import usePagination from './Hooks/usePagination.js';

import ShiftSelector from './Filters/ShiftSelector.js';
import DatePickerComponent from './Filters/DatePicker.js';

import { shifts } from './Utils/constants.js';

// Import Sort Icons
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const ReservationsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const isMobile = useIsMobile();

  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');

  const { searchQuery } = useContext(SearchContext);
  const itemsPerPage = 12;

  // Sorting State: { key: 'aantalGasten' | 'tijdstip', direction: 'asc' | 'desc' }
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const filteredReservationsData = useFilteredReservations(reservationsData, {
    searchQuery,
    nameSearch,
    guestsSearch,
    timeSearch,
    selectedDate,
    selectedShift,
  });

  // Sorting Logic
  const sortedReservationsData = useMemo(() => {
    const sortedData = [...filteredReservationsData];
    if (sortConfig.key && sortConfig.direction) {
      sortedData.sort((a, b) => {
        if (sortConfig.key === 'aantalGasten') {
          // Sort numerically
          return sortConfig.direction === 'asc'
            ? a.aantalGasten - b.aantalGasten
            : b.aantalGasten - a.aantalGasten;
        } else if (sortConfig.key === 'tijdstip') {
          // Sort by time
          const timeA = a.tijdstip.split(':').map(Number);
          const timeB = b.tijdstip.split(':').map(Number);
          const dateA = new Date();
          dateA.setHours(timeA[0], timeA[1], 0, 0);
          const dateB = new Date();
          dateB.setHours(timeB[0], timeB[1], 0, 0);
          return sortConfig.direction === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        return 0;
      });
    }
    return sortedData;
  }, [filteredReservationsData, sortConfig]);

  const { currentData: currentReservations, totalPages } = usePagination(
    sortedReservationsData,
    currentPage,
    itemsPerPage
  );

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setCurrentPage(1);
  };

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // Remove sorting
      key = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="reservations-page">
      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        handleDateChange={handleDateChange}
      />

      <ShiftSelector
        shifts={shifts}
        selectedShift={selectedShift}
        setSelectedShift={setSelectedShift}
        isShiftOptionsOpen={isShiftOptionsOpen}
        setIsShiftOptionsOpen={setIsShiftOptionsOpen}
        setCurrentPage={setCurrentPage}
      />

      <SearchFilters
        nameSearch={nameSearch}
        setNameSearch={setNameSearch}
        guestsSearch={guestsSearch}
        setGuestsSearch={setGuestsSearch}
        timeSearch={timeSearch}
        setTimeSearch={setTimeSearch}
      />

      <div className="reservations-container">
        <div className={`reservations-grid ${isMobile ? 'mobile-grid' : ''}`}>
          {!isMobile && (
            <div className="reservations-header reservation-row">
              {/* Number of Guests Header */}
              <div
                className="header-cell guests-header"
                onClick={() => handleSort('aantalGasten')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                #
                <span className="sort-icon">
                  {sortConfig.key === 'aantalGasten' && sortConfig.direction === 'asc' && (
                    <FaSortUp />
                  )}
                  {sortConfig.key === 'aantalGasten' && sortConfig.direction === 'desc' && (
                    <FaSortDown />
                  )}
                </span>
              </div>

              {/* Hour Header */}
              <div
                className="header-cell hour-header"
                onClick={() => handleSort('tijdstip')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Uur
                <span className="sort-icon">
                  {sortConfig.key === 'tijdstip' && sortConfig.direction === 'asc' && (
                    <FaSortUp />
                  )}
                  {sortConfig.key === 'tijdstip' && sortConfig.direction === 'desc' && (
                    <FaSortDown />
                  )}
                </span>
              </div>

              <div>Naam</div>
              <div>Email</div>
              <div>Telefoon</div>
              <div></div>
            </div>
          )}

          {currentReservations.map((reservation) => (
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
