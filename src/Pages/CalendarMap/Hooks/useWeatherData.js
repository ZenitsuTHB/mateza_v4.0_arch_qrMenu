// Hooks/useWeatherData.js

import { useState, useEffect } from 'react';
import axios from 'axios';

// Global cache for session-based storage
const weatherDataCache = {};

const useWeatherData = (startDate, endDate, fetchWeather) => {
  const [weatherDataByDate, setWeatherDataByDate] = useState({});

  // Convert dates to strings outside useEffect to use in dependencies
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];
  const cacheKey = `${startDateString}_${endDateString}`;

  useEffect(() => {
    if (!fetchWeather) {
      setWeatherDataByDate({});
      return;
    }

    // Check if data is already cached
    if (weatherDataCache[cacheKey]) {
      setWeatherDataByDate(weatherDataCache[cacheKey]);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const location = 'Belgium';
        const apiKey = 'GAZWF5VDN8V6CUKNR9M9F7KUK'; // Replace with your actual API key

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDateString}/${endDateString}?key=${apiKey}&unitGroup=metric&include=days&elements=datetime,temp`;

        // Print curl command to console
        console.log(`curl -X GET "${url}"`);

        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {};
        data.days.forEach(day => {
          const dateStr = day.datetime;
          weatherData[dateStr] = day.temp;
        });

        // Store data in cache and update state
        weatherDataCache[cacheKey] = weatherData;
        setWeatherDataByDate(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [cacheKey, fetchWeather]);

  return weatherDataByDate;
};

export default useWeatherData;
