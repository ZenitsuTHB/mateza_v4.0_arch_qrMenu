// src/components/Modal/hooks/useSchemeValidation.js

import { useState } from 'react';

const useSchemeValidation = (items, schemeSettings) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    items.forEach((item) => {
      if (schemeSettings[item.id]?.enabled) {
        if (item.type === 'day') {
          const { startTime, endTime } = schemeSettings[item.id];
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
