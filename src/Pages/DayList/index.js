// ReservationsList.js

import React, { useState, useEffect, useContext } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../Context/SearchContext.js';
import './css/reservationList.css';
import './css/settingsTabs.css';

import {
  formatDateForFilter,
  timeToMinutes,
} from '../../Utils/dateUtils.js';

import ShiftSelector from './Filters/ShiftSelector.js';
import DatePickerComponent from './Filters/DatePicker.js';

const ReservationsList = () => {
  const shifts = {
    Ochtend: { start: '04:00', end: '11:00' },
    Middag: { start: '11:00', end: '16:00' },
    Avond: { start: '16:00', end: '23:00' },
    'Volledig Dag': { start: '00:00', end: '23:59' },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');

  const { searchQuery } = useContext(SearchContext);
  const itemsPerPage = 12;

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

  const filteredReservationsData = reservationsData.filter((reservation) => {
    const generalMatch = !searchQuery || (() => {
      const query = searchQuery.toLowerCase();

      const fullName = `${reservation.firstName || ''} ${reservation.lastName || ''}`.toLowerCase();
      const guests = reservation.aantalGasten ? reservation.aantalGasten.toString() : '';
      const time = (reservation.tijdstip || '').toLowerCase();
      const email = (reservation.email || '').toLowerCase();
      const phone = (reservation.telefoon || '').toLowerCase();

      return (
        fullName.includes(query) ||
        guests.includes(query) ||
        time.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    })();

    const matchesName = !nameSearch || (() => {
      const fullName = `${reservation.firstName || ''} ${reservation.lastName || ''}`.toLowerCase();
      return fullName.includes(nameSearch.toLowerCase());
    })();

    const matchesGuests = !guestsSearch || (() => {
      return reservation.aantalGasten
        ? reservation.aantalGasten.toString().includes(guestsSearch)
        : false;
    })();

    const matchesTime = !timeSearch || (() => {
      return reservation.tijdstip
        ? reservation.tijdstip.toLowerCase().includes(timeSearch.toLowerCase())
        : false;
    })();

    const matchesDate = !selectedDate || (() => {
      const formattedSelectedDate = formatDateForFilter(selectedDate);
      return reservation.date === formattedSelectedDate;
    })();

    const matchesShift = !selectedShift || (() => {
      const shift = shifts[selectedShift];
      if (!shift || !reservation.tijdstip) return false;
      const reservationMinutes = timeToMinutes(reservation.tijdstip);
      const shiftStart = timeToMinutes(shift.start);
      const shiftEnd = timeToMinutes(shift.end);
      return reservationMinutes >= shiftStart && reservationMinutes <= shiftEnd;
    })();

    return generalMatch && matchesName && matchesGuests && matchesTime && matchesDate && matchesShift;
  });

  const totalPages = Math.ceil(filteredReservationsData.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservationsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setCurrentPage(1);
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
        <div
          className={`reservations-grid ${isMobile ? 'mobile-grid' : ''}`}
        >
          {!isMobile && (
            <div className="reservations-header reservation-row">
              <div>#</div>
              <div>Uur</div>
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
