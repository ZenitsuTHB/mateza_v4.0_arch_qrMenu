// src/Hooks/useRestaurantData.js

import { useState, useEffect } from 'react';

const useFetchRestaurantData = () => {
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(window.baseDomain + 'api/auth-restaurant/');
        const data = await response.json();
        window.restaurantData = data;
        setRestaurantData(data);

        console.log(window.restaurantData);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, []);

  return restaurantData;
};

export default useFetchRestaurantData;
