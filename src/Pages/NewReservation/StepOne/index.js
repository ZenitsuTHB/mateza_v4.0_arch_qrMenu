// src/components/ReservationForm/ReservationStepOne.jsx

import React, { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';
import ValueSelectorGuests from './ValueSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

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

  // Fetch timeblocks on component mount
  useEffect(() => {
    const fetchTimeblocks = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/auth-restaurant/`);
        setTimeblocks(data.timeblocks || []);
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

      {/* Only show DateSelector after numberOfGuests is selected */}
      {formData.numberOfGuests && (
        <DateSelector
          formData={formData}
          handleChange={handleChange}
          resetFormDataFields={resetFormDataFields}
          timeblocks={timeblocks} // Use fetched timeblocks
        />
      )}

      {/* Only show TimeSelector after date is selected */}
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
