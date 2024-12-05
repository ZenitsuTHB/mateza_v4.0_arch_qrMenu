import React from 'react';
import Calendar from './Calendar';
import moment from 'moment';

const DateSelector = ({
  guests,
  formData,
  handleChange,
  resetFormDataFields,
  timeblocks,
  restaurantData,
  reservations, // Receive reservations as prop
  startDate, // Receive startDate as prop
  onWeekChange, // Receive onWeekChange as prop
  reservationMode,
}) => {
  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log('Selected date:', formattedDate);
    handleChange({
      target: { name: 'date', value: formattedDate },
    });
    resetFormDataFields(['time']);
  };

  return (
    <div className="form-group date-selector-container">
      <Calendar
        guests={guests} // Pass down guests
        selectedDate={formData.date || null}
        onSelectDate={handleDateSelect}
        autoExpand={false}
        reservationMode={formData.reservationMode}
        restaurantData={restaurantData}
        startDate={startDate} // Pass down startDate
        onWeekChange={onWeekChange} // Pass down onWeekChange handler
        reservations={reservations} // Pass down reservations
      />
    </div>
  );
};

export default DateSelector;
