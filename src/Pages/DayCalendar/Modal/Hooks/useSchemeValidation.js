import { useState } from 'react';

const useSchemeValidation = (items, schemeSettings) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    items.forEach((item) => {
      const settings = schemeSettings[item.id];
      if (settings?.enabled) {
        if (item.type === 'day') {
          const { startTime, endTime, shiftsEnabled, shifts = [] } = settings;

          // Validate startTime and endTime
          if (!startTime || !endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeEmpty: 'Start tijd en eindtijd moeten ingevuld zijn.',
            };
            console.log(
              `Validation Error [Item ID: ${item.id}]: timeEmpty - Start tijd en eindtijd moeten ingevuld zijn.`
            );
          } else if (startTime >= endTime) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              timeOrder: 'Start tijd moet voor eindtijd zijn.',
            };
            console.log(
              `Validation Error [Item ID: ${item.id}]: timeOrder - Start tijd moet voor eindtijd zijn.`
            );
          }

          // Validate shifts if enabled
          if (shiftsEnabled) {
            shifts.forEach((shift, index) => {
              // Initialize shift errors object
              if (!newErrors[item.id]) newErrors[item.id] = {};
              if (!newErrors[item.id].shifts) newErrors[item.id].shifts = {};
              if (!newErrors[item.id].shifts[index]) newErrors[item.id].shifts[index] = {};

              // Validate shift name
              if (!shift.name) {
                newErrors[item.id].shifts[index].name = 'Shift naam moet ingevuld zijn.';
                console.log(
                  `Validation Error [Item ID: ${item.id}, Shift Index: ${index}]: name - Shift naam moet ingevuld zijn.`
                );
              }

              // Validate shift startTime
              if (!shift.startTime) {
                newErrors[item.id].shifts[index].startTime =
                  'Shift start tijd moet ingevuld zijn.';
                console.log(
                  `Validation Error [Item ID: ${item.id}, Shift Index: ${index}]: startTime - Shift start tijd moet ingevuld zijn.`
                );
              }

              // Validate shift startTime range within day's startTime and endTime
              if (shift.startTime && startTime && endTime) {
                if (shift.startTime < startTime || shift.startTime > endTime) {
                  newErrors[item.id].shifts[index].startTimeRange =
                    'Shift start tijd moet binnen de openingsuren vallen.';
                  console.log(
                    `Validation Error [Item ID: ${item.id}, Shift Index: ${index}]: startTimeRange - Shift start tijd moet binnen de openingsuren vallen.`
                  );
                }
              }
            });
          }
        } else if (item.type === 'duration') {
          const { startDate, endDate } = settings;

          // Validate startDate and endDate
          if (!startDate || !endDate) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateEmpty: 'Start datum en einddatum moeten ingevuld zijn.',
            };
            console.log(
              `Validation Error [Item ID: ${item.id}]: dateEmpty - Start datum en einddatum moeten ingevuld zijn.`
            );
          } else if (new Date(startDate) > new Date(endDate)) {
            newErrors[item.id] = {
              ...newErrors[item.id],
              dateOrder: 'Start datum moet voor einddatum zijn.',
            };
            console.log(
              `Validation Error [Item ID: ${item.id}]: dateOrder - Start datum moet voor einddatum zijn.`
            );
          }
        }
      }
    });

    setErrors(newErrors);

    // Optionally, log the entire errors object after validation
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation Completed with Errors:', newErrors);
    } else {
      console.log('Validation Passed: No Errors Found.');
    }

    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};

export default useSchemeValidation;
