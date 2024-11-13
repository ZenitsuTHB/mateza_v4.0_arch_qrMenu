// /src/Components/Calendar/Hooks/useReservations.js

import { useState, useEffect } from 'react';
import reservations from '../reservationData';

const useReservations = () => {
  const [reservationsByDate, setReservationsByDate] = useState({});

  useEffect(() => {
    const resByDate = {};
    reservations.forEach((reservation) => {
      const date = reservation.date;
      if (!resByDate[date]) {
        resByDate[date] = [];
      }
      resByDate[date].push(reservation);
    });
    setReservationsByDate(resByDate);
  }, []);

  return reservationsByDate;
};

export default useReservations;
