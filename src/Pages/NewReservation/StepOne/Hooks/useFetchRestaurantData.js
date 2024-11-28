// src/Hooks/useFetchRestaurantData.js

import { useState, useEffect } from 'react';
import useApi from '../../../../Hooks/useApi';

const useFetchRestaurantData = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const api = useApi();


  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const endpoint = `${window.baseDomain}api/auth-restaurant/`;
        const response = await api.get(endpoint);

        if (response) {
          setRestaurantData(response);
        }

      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        const errorCode = error.response?.status || 'unknown';
      }
    };

    fetchRestaurantData();
  }, [api]);

  return restaurantData;
};

export default useFetchRestaurantData;
