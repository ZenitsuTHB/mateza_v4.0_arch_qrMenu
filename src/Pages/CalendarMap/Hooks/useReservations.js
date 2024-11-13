// src/Components/Calendar/Hooks/useReservations.js

import { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi'; // Adjust the import path as needed

const useReservations = (currentDate) => {
  const [reservationsByDate, setReservationsByDate] = useState({});
  const api = useApi();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Calculate start and end dates for the month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Format dates as ISO strings (YYYY-MM-DD)
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        // Make API request to fetch reservations for the date range
        const endpoint = window.baseDomain + `/api/reservations?startDate=${startDateString}&endDate=${endDateString}`;
        const data = await api.get(endpoint, { noCache: true });

        console.log('Data received from server:', data);

        // Process data into reservationsByDate
        const resByDate = {};

        data.forEach((reservation) => {
          // Convert MongoDB extended JSON to standard types
          const date = reservation.date;
          const numberOfPeople = parseInt(
            reservation.numberOfPeople?.$numberInt || reservation.numberOfPeople,
            10
          );
          const _id = reservation._id?.$oid || reservation._id;

          // Create a new reservation object with required fields
          const formattedReservation = {
            id: _id,
            date,
            time: reservation.time,
            fullName: `${reservation.firstName} ${reservation.lastName}`,
            email: reservation.email,
            phone: reservation.phone,
            aantalGasten: 3,
            extra: reservation.extraInfo || null,
            // Include additional fields if needed
          };

          if (!resByDate[date]) {
            resByDate[date] = [];
          }
          resByDate[date].push(formattedReservation);
        });

        setReservationsByDate(resByDate);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        // Handle error appropriately
      }
    };

    fetchReservations();
  }, [api, currentDate]);

  return reservationsByDate;
};

export default useReservations;
