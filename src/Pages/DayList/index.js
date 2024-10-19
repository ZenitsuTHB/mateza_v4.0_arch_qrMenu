// ReservationsList.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import reservationsData from './data.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../Context/SearchContext.js'; // Ensure correct path
import './css/reservationList.css';
import './css/settingsTabs.css';

// Importing React DatePicker and necessary styles
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Importing FontAwesome icons
import { FaCalendarAlt, FaList } from 'react-icons/fa';

const ReservationsList = () => {
  // **Shift Time Intervals**
  const shifts = {
    Ochtend: { start: '04:00', end: '11:00' },
    Middag: { start: '11:00', end: '16:00' },
    Avond: { start: '16:00', end: '23:00' },
    'Volledig Dag': { start: '00:00', end: '23:59' },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // **Define State Variables for SearchFilters**
  const [nameSearch, setNameSearch] = useState('');
  const [guestsSearch, setGuestsSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');

  // **State Variables for Date Picker**
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize to today
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // **State Variables for Shift Selection**
  const [isShiftOptionsOpen, setIsShiftOptionsOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');

  const { searchQuery } = useContext(SearchContext);
  const itemsPerPage = 12;

  // **Refs for Click Outside Handling**
  const shiftButtonRef = useRef(null);
  const shiftOptionsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // **Handle Click Outside for Shift Options**
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shiftOptionsRef.current &&
        !shiftOptionsRef.current.contains(event.target) &&
        shiftButtonRef.current &&
        !shiftButtonRef.current.contains(event.target)
      ) {
        setIsShiftOptionsOpen(false);
      }
    };

    if (isShiftOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShiftOptionsOpen]);

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

  // **Function to format date to YYYY-MM-DD**
  const formatDateForFilter = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-based
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // **Function to format date in Dutch format (e.g., 19 oktober 2024)**
  const formatDateDutch = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('nl-NL', options);
  };

  // **Function to check if the date is today**
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // **Function to convert time string to minutes**
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // **Update the Filtering Logic to Handle Undefined Properties, Selected Date, and Selected Shift**
  const filteredReservationsData = reservationsData.filter((reservation) => {
    // General search from TopBar
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

    // Specific filters from SearchFilters
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

    // Filter by selected date if any
    const matchesDate = !selectedDate || (() => {
      const formattedSelectedDate = formatDateForFilter(selectedDate);
      return reservation.date === formattedSelectedDate;
    })();

    // Filter by selected shift if any
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

  // **Handle Date Selection**
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // **Handle Shift Selection**
  const handleShiftSelection = (shift) => {
    setSelectedShift(shift);
    setIsShiftOptionsOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // **Handle Shift Button Toggle**
  const toggleShiftOptions = () => {
    setIsShiftOptionsOpen(!isShiftOptionsOpen);
  };

  return (
    <div className="reservations-page">
      
      {/* h2 Title Displaying Selected Date */}
      {selectedDate && (
        <h2 className="selected-date">
          {isToday(selectedDate) ? 'Vandaag' : formatDateDutch(selectedDate)}
        </h2>
      )}
      
      {/* Button to open Date Picker */}
      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="date-button"
      >
        <FaCalendarAlt className="date-button-icon" />
        {selectedDate ? (
          isToday(selectedDate) ? 'Vandaag' : `${formatDateDutch(selectedDate)}`
        ) : 'Datum'}
      </button>
      <button
        onClick={toggleShiftOptions}
        className="shift-button"
        ref={shiftButtonRef}
      >
        <FaList className="shift-button-icon" />
        {selectedShift ? `${selectedShift}` : 'Shift'}
      </button>

      {/* Shift Options Dropdown */}
      {isShiftOptionsOpen && (
        <div className="shift-options-container" ref={shiftOptionsRef}>
          {Object.keys(shifts).map((shift) => (
            <div
              key={shift}
              className="shift-option"
              onClick={() => handleShiftSelection(shift)}
            >
              {shift}
            </div>
          ))}
        </div>
      )}

      {/* React DatePicker Popup */}
      {isDatePickerOpen && (
        <div className="date-picker-popup">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            locale="nl"
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecteer een datum"
            todayButton="Vandaag"
          />
        </div>
      )}

      {/* Search Filters */}
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
