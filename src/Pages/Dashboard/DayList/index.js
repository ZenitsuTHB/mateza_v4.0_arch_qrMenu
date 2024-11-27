// src/Components/ReservationsList/ReservationsList.js

import React, { useState, useContext } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import ReservationRow from './ReservationRow/index.js';
import Pagination from './Pagination.js';
import SearchFilters from './SearchFilters/index.js';
import { SearchContext } from '../../../Context/SearchContext.js';
import useIsMobile from './Hooks/useIsMobile.js';
import useFilteredReservations from './Hooks/useFilteredReservations.js';
import usePagination from './Hooks/usePagination.js';
import ShiftSelector from './Filters/ShiftSelector.js';
import DatePickerComponent from './Filters/DatePicker.js';
import useSortedReservations from './Hooks/useSortedReservation.js';
import { getNewSortConfig } from './Utils/sortUtils.js';
import { shifts } from './Utils/constants.js';
import { FaSortUp, FaSortDown, FaFilter, FaPrint } from 'react-icons/fa'; // Import icons
import './css/reservationList.css';
import './css/settingsTabs.css';

// Import the new useReservationsList hook
import useReservationsList from './Hooks/useReservationsList.js';
import useNotification from '../../../Components/Notification/index.js';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard/index.js';

// Import ModalWithoutTabs

const FIELD_CONFIG = [
  { key: 'aantalGasten', label: 'Aantal Gasten', alwaysVisible: true },
  { key: 'tijdstip', label: 'Tijdstip', alwaysVisible: true },
  { key: 'fullName', label: 'Naam', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'phone', label: 'Telefoon', defaultVisible: true },
  { key: 'extra', label: 'Extra Informatie', defaultVisible: false },
  { key: 'language', label: 'Taal', defaultVisible: false },
  { key: 'menu', label: 'Menu', defaultVisible: false },
  { key: 'createdAt', label: 'Aangemaakt Op', defaultVisible: false },
  { key: 'actions', label: '', alwaysVisible: true }, // For actions
];

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

  // Use the new hook to fetch reservations data
  const { reservationsData, loading, error } = useReservationsList();

  // Initialize the useNotification hook
  const { triggerNotification, NotificationComponent } = useNotification();

  // Filter, sort, and paginate the reservations data
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

  const [visibleFields, setVisibleFields] = useState(
    FIELD_CONFIG.filter((field) => field.defaultVisible || field.alwaysVisible).map((field) => field.key)
  );

  const [isFieldSelectorModalOpen, setIsFieldSelectorModalOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFieldSelectorModalOpen(true);
  };

  const handlePrintClick = () => {
    window.print();
  };

  const FieldSelectorModal = ({ visibleFields, setVisibleFields, onClose }) => {
    const [selectedFields, setSelectedFields] = useState(visibleFields);

    const handleCheckboxChange = (fieldKey) => {
      if (selectedFields.includes(fieldKey)) {
        setSelectedFields(selectedFields.filter((key) => key !== fieldKey));
      } else {
        setSelectedFields([...selectedFields, fieldKey]);
      }
    };

    const handleApply = () => {
      setVisibleFields(selectedFields);
      onClose();
    };

    return (
      <ModalWithoutTabs
        content={
          <div className="field-selector-modal">
            <h2>Selecteer velden om weer te geven</h2>
            <div className="field-options">
              {FIELD_CONFIG.map((field) => (
                <div key={field.key} className="field-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleCheckboxChange(field.key)}
                      disabled={field.alwaysVisible}
                    />
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
            <button onClick={handleApply}>Toepassen</button>
          </div>
        }
        onClose={onClose}
      />
    );
  };

  return (
    <div className="reservations-page">
      {/* Render the NotificationComponent */}
      <NotificationComponent />

      {/* Include the FieldSelectorModal */}
      {isFieldSelectorModalOpen && (
        <FieldSelectorModal
          visibleFields={visibleFields}
          setVisibleFields={setVisibleFields}
          onClose={() => setIsFieldSelectorModalOpen(false)}
        />
      )}

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
        {loading ? (
          <div>Loading reservations...</div>
        ) : error ? (
          <div>Error loading reservations: {error.message}</div>
        ) : (
          <>
            <div
              className={`reservations-grid ${isMobile ? 'mobile-grid' : ''}`}
              style={{ '--columns': visibleFields.length }}
            >
              {!isMobile && (
                <div className="reservations-header reservation-row">
                  {visibleFields.map((fieldKey) => {
                    const fieldConfig = FIELD_CONFIG.find((field) => field.key === fieldKey);
                    return (
                      <div
                        key={fieldKey}
                        className={`header-cell ${fieldKey}-header`}
                        onClick={() => handleSort(fieldKey)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {fieldConfig.label}
                        {fieldConfig.label && (
                          <span className="sort-icon">
                            {sortConfig.key === fieldKey && sortConfig.direction === 'asc' && <FaSortUp />}
                            {sortConfig.key === fieldKey && sortConfig.direction === 'desc' && <FaSortDown />}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {currentReservations.length > 0 ? (
                currentReservations.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    visibleFields={visibleFields}
                    isMobile={isMobile}
                    isTooltipOpen={openTooltipId === reservation.id}
                    onTooltipToggle={handleTooltipToggle}
                    onTooltipClose={handleTooltipClose}
                    triggerNotification={triggerNotification}
                  />
                ))
              ) : (
                <div
                  className={`no-reservations-row ${
                    isMobile ? 'no-reservations-mobile' : 'no-reservations-desktop'
                  }`}
                >
                  <span>
                    {selectedShift === 'Dag'
                      ? 'Geen reservaties voor deze dag.'
                      : 'Geen reservaties voor deze shift.'}
                  </span>
                </div>
              )}
            </div>
            {currentReservations.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
              />
            )}

            {/* Buttons below the pagination */}
            <div className="buttons-container">
              <button className="filter-button" onClick={handleFilterClick}>
                <FaFilter className="button-icon" />
                Filter
              </button>
              <button className="print-button" onClick={handlePrintClick}>
                <FaPrint className="button-icon" />
                Print
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withHeader(ReservationsList);
