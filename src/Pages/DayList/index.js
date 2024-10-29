// ReservationsList.js

import React, { useState, useContext, useMemo } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../Context/SearchContext.js';
import useIsMobile from './Hooks/useIsMobile.js';
import useFilteredReservations from './Hooks/useFilteredReservations.js';
import usePagination from './Hooks/usePagination.js';
import ShiftSelector from './Filters/ShiftSelector.js';
import DatePickerComponent from './Filters/DatePicker.js';
import useSortedReservations from './Hooks/useSortedReservation.js';
import { getNewSortConfig } from './Utils/sortUtils.js'

import { shifts } from './Utils/constants.js';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import './css/reservationList.css';
import './css/settingsTabs.css';

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const filteredReservationsData = useFilteredReservations(reservationsData, {
    searchQuery,
    nameSearch,
    guestsSearch,
    timeSearch,
    selectedDate,
    selectedShift,
  });

  const sortedReservationsData = useSortedReservations(filteredReservationsData, sortConfig);

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

const handleSort = (key) => {
    const newSortConfig = getNewSortConfig(sortConfig, key);
    setSortConfig(newSortConfig);
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
