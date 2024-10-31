import { useState } from 'react';

const useSchemeValidation = (items, schemeSettings) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    // Initialize an empty errors object
    const newErrors = {};

    items.forEach((item) => {
      const settings = schemeSettings[item.id];
      if (settings?.enabled) {
        const itemErrors = [];

        if (item.type === 'day') {
          const { startTime, endTime, shiftsEnabled, shifts = [] } = settings;

          // Validate startTime and endTime
          if (!startTime || !endTime) {
            itemErrors.push('Start tijd en eindtijd moeten ingevuld zijn.');
          } else if (startTime >= endTime) {
            itemErrors.push('Start tijd moet voor eindtijd zijn.');
          }

          // Validate that shifts are provided if shiftsEnabled is true
          if (shiftsEnabled) {
            if (!shifts || shifts.length === 0) {
              itemErrors.push('Er moeten minimaal één shift worden gedefinieerd wanneer shifts zijn ingeschakeld.');
            } else {
              shifts.forEach((shift, index) => {
                const shiftErrors = [];

                // Validate shift name
                if (!shift.name) {
                  shiftErrors.push('Shift naam moet ingevuld zijn.');
                }

                // Validate shift startTime
                if (!shift.startTime) {
                  shiftErrors.push('Shift start tijd moet ingevuld zijn.');
                }

                // Validate shift startTime within day's startTime and endTime
                if (shift.startTime && startTime && endTime) {
                  if (shift.startTime < startTime || shift.startTime > endTime) {
                    shiftErrors.push('Shift start tijd moet binnen de openingsuren vallen.');
                  }
                }

                // If there are errors for this shift, add them to newErrors
                if (shiftErrors.length > 0) {
                  newErrors[`${item.id}.shifts.${index}`] = shiftErrors;
                }
              });
            }
          }
        } else if (item.type === 'duration') {
          const { startDate, endDate } = settings;

          // Validate startDate and endDate
          if (!startDate || !endDate) {
            itemErrors.push('Start datum en einddatum moeten ingevuld zijn.');
          } else if (new Date(startDate) > new Date(endDate)) {
            itemErrors.push('Start datum moet voor einddatum zijn.');
          }
        }

        // If there are errors for this item, add them to newErrors
        if (itemErrors.length > 0) {
          newErrors[item.id] = itemErrors;
        }
      }
    });

    // Update the errors state with new errors
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};

export default useSchemeValidation;
