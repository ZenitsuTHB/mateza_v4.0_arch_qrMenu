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


  if (timeblocksError) {
    return (
      <div>
        <a
          href="https://dashboard.reservaties.net/#/scheme"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007BFF', textDecoration: 'underline' }}
        >
          Klik hier
        </a>{' '}
        om uw openingsuren in te stellen.
      </div>
    );
  }

  return (
    <form className="account-manage-form" onSubmit={handleStepOneSubmit} noValidate>
      <ValueSelectorGuests
        value={formData.guests}
        onChange={handleChange}
        error={errors.guests}
      />

      {formData.guests && (
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
    </form>
  );
};

export default ReservationStepOne;
