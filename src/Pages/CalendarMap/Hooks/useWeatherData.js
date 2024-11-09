// Hooks/useWeatherData.js

import { useState, useEffect } from 'react';
import axios from 'axios';

// Global cache for session-based storage
const weatherDataCache = {}; // dateString => temperature

const useWeatherData = (startDate, endDate, fetchWeather) => {
  const [weatherDataByDate, setWeatherDataByDate] = useState({});

  // Convert dates to strings outside useEffect to use in dependencies
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!fetchWeather) {
      setWeatherDataByDate({});
      return;
    }

    const fetchWeatherData = async () => {
      const apiKey = 'GAZWF5VDN8V6CUKNR9M9F7KUK'; // Replace with your actual API key
      const location = 'Belgium';

      // Generate all dateStrings in the range
      const dateStrings = [];
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dateStrings.push(d.toISOString().split('T')[0]);
      }

      // Determine which dates are missing from the cache
      const missingDates = dateStrings.filter(
        (dateStr) => !weatherDataCache[dateStr]
      );

      if (missingDates.length === 0) {
        // All data is cached
        const data = {};
        dateStrings.forEach((dateStr) => {
          data[dateStr] = weatherDataCache[dateStr];
        });
        setWeatherDataByDate(data);
        return;
      }

      // Group missing dates into continuous ranges
      const missingDateObjects = missingDates.map((dateStr) => new Date(dateStr));
      missingDateObjects.sort((a, b) => a - b);

      const ranges = [];
      let rangeStart = missingDateObjects[0];
      let rangeEnd = missingDateObjects[0];

      for (let i = 1; i < missingDateObjects.length; i++) {
        const currentDate = missingDateObjects[i];
        const previousDate = missingDateObjects[i - 1];
        const diffDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          // Consecutive date
          rangeEnd = currentDate;
        } else {
          // Non-consecutive date, close current range and start new
          ranges.push({ start: rangeStart, end: rangeEnd });
          rangeStart = currentDate;
          rangeEnd = currentDate;
        }
      }
      // Add the last range
      ranges.push({ start: rangeStart, end: rangeEnd });

      try {
        // Fetch data for each range
        for (const range of ranges) {
          const rangeStartDateStr = range.start.toISOString().split('T')[0];
          const rangeEndDateStr = range.end.toISOString().split('T')[0];

          const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${rangeStartDateStr}/${rangeEndDateStr}?key=${apiKey}&unitGroup=metric&include=days&elements=datetime,temp`;

          // Print curl command to console
          console.log(`curl -X GET "${url}"`);

          const response = await axios.get(url);
          const data = response.data;

          data.days.forEach((day) => {
            const dateStr = day.datetime;
            weatherDataCache[dateStr] = day.temp;
          });
        }

        // Now assemble the data from cache
        const assembledData = {};
        dateStrings.forEach((dateStr) => {
          assembledData[dateStr] = weatherDataCache[dateStr];
        });
        setWeatherDataByDate(assembledData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [startDateString, endDateString, fetchWeather]);

  return weatherDataByDate;
};

export default useWeatherData;
