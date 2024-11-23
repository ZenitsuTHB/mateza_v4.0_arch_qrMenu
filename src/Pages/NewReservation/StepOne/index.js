// src/Pages/NewReservation/ReservationStepOne.jsx

import React, { useState, useEffect } from 'react';
import ValueSelectorGuests from './ValueSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import useApi from '../../../Hooks/useApi';

const ReservationStepOne = ({
  formData,
  errors,
  handleChange,
  handleStepOneSubmit,
  setFormData,
}) => {
  const api = useApi();

  // State for timeblocks
  const [timeblocks, setTimeblocks] = useState([]);
  const [loadingTimeblocks, setLoadingTimeblocks] = useState(true);
  const [timeblocksError, setTimeblocksError] = useState(null);

  // Fetch timeblocks and general settings on component mount
  useEffect(() => {
    const fetchTimeblocks = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/auth-restaurant/`, { noCache: true });
        setTimeblocks(data.timeblocks || []);
        window.timeblocks = data.timeblocks || []; // Retain globally if needed
        const generalSettings = data['general-settings'] || {};
        window.generalSettings = generalSettings; // Retain globally
      } catch (err) {
        setTimeblocksError(err);
        console.error('Error fetching timeblocks:', err);
      } finally {
        setLoadingTimeblocks(false);
      }
    };

    fetchTimeblocks();
  }, [api]);

  const resetFormDataFields = (fieldsToReset) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };
      fieldsToReset.forEach((field) => {
        newFormData[field] = '';
      });
      return newFormData;
    });
  };

  if (loadingTimeblocks) {
    return <div>Loading timeblocks...</div>;
  }

  if (timeblocksError) {
    return <div>Error loading timeblocks: {timeblocksError.message}</div>;
  }

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <ValueSelectorGuests
        value={formData.numberOfGuests}
        onChange={handleChange}
        error={errors.numberOfGuests}
      />

      {formData.numberOfGuests && (
        <DateSelector
          formData={formData}
          handleChange={handleChange}
          resetFormDataFields={resetFormDataFields}
          timeblocks={timeblocks}
        />
      )}

      {formData.date && (
        <TimeSelector
          formData={formData}
          handleChange={handleChange}
          field={{ id: 'time', label: 'Tijd' }}
          selectedDate={formData.date}
        />
      )}

      <button type="submit" className="account-manage__button">
        Verder
      </button>
    </form>
  );
};

export default ReservationStepOne;
