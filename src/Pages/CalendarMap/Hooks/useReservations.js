import { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';

const useReservations = (currentDate = new Date('2024-10-01')) => {
  const [reservationsByDate, setReservationsByDate] = useState({});
  const api = useApi();

  useEffect(() => {
    if (!currentDate) {
      console.error('currentDate is undefined in useReservations');
      return;
    }

    const fetchReservations = async () => {
      try {
        // Calculate start and end dates for the month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Format dates as ISO strings (YYYY-MM-DD)
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];

        // Make API request to fetch reservations for the date range
        const endpoint = `${window.baseDomain}api/reservations?startDate=${startDateString}&endDate=${endDateString}`;
        const data = await api.get(endpoint);

        console.log('Data received from server:', data);

        // Process data into reservationsByDate
        const resByDate = {};

        data.forEach((reservation) => {
          const date = reservation.date;
          const numberOfPeople = parseInt(
            reservation.numberOfPeople?.$numberInt || reservation.numberOfPeople,
            10
          );
          const _id = reservation._id?.$oid || reservation._id;

          const formattedReservation = {
            id: _id,
            date,
            time: reservation.time,
            fullName: `${reservation.firstName} ${reservation.lastName}`,
            email: reservation.email,
            phone: reservation.phone,
            aantalGasten: numberOfPeople,
            extra: reservation.extraInfo || null,
          };

          if (!resByDate[date]) {
            resByDate[date] = [];
          }
          resByDate[date].push(formattedReservation);
        });

        setReservationsByDate(resByDate);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [api, currentDate]);

  return reservationsByDate;
};

export default useReservations;
