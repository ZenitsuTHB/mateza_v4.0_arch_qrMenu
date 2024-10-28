// src/components/Modal/hooks/useSchemaValidation.js

import { useState } from 'react';

const useSchemaValidation = (items, schemaSettings) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    items.forEach((item) => {
      if (schemaSettings[item.id]?.enabled) {
        if (item.type === 'day') {
          const { startTime, endTime } = schemaSettings[item.id];
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
          const { startDate, endDate } = schemaSettings[item.id];
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

export default useSchemaValidation;
