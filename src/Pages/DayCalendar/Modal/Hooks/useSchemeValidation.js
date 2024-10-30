import { useState } from 'react';

const useSchemeValidation = (items, schemeSettings) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    items.forEach((item) => {
      if (schemeSettings[item.id]?.enabled) {
        if (item.type === 'day') {
          const { startTime, endTime, shiftsEnabled, shifts = [] } = schemeSettings[item.id];
          // Existing validation for startTime and endTime
          if (!startTime || !endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeEmpty: 'Start tijd en eindtijd moeten ingevuld zijn.',
            };
          } else if (startTime >= endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeOrder: 'Start tijd moet voor eindtijd zijn.',
            };
          }

          // New validation for shifts
          if (shiftsEnabled) {
            shifts.forEach((shift, index) => {
              // Initialize shift errors object
              if (!newErrors[item.id]) newErrors[item.id] = {};
              if (!newErrors[item.id].shifts) newErrors[item.id].shifts = {};
              if (!newErrors[item.id].shifts[index]) newErrors[item.id].shifts[index] = {};

              // Check if name and startTime are filled
              if (!shift.name) {
                newErrors[item.id].shifts[index].name = 'Shift naam moet ingevuld zijn.';
              }
              if (!shift.startTime) {
                newErrors[item.id].shifts[index].startTime = 'Shift start tijd moet ingevuld zijn.';
              }

              // Check if shift startTime is within day's startTime and endTime
              if (shift.startTime && startTime && endTime) {
                if (shift.startTime < startTime || shift.startTime > endTime) {
                  newErrors[item.id].shifts[index].startTimeRange =
                    'Shift start tijd moet binnen de openingsuren vallen.';
                }
              }
            });
          }
        } else if (item.type === 'duration') {
          const { startDate, endDate } = schemeSettings[item.id];
          if (!startDate || !endDate) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateEmpty: 'Start datum en einddatum moeten ingevuld zijn.',
            };
          } else if (new Date(startDate) > new Date(endDate)) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateOrder: 'Start datum moet voor einddatum zijn.',
            };
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};

export default useSchemeValidation;
