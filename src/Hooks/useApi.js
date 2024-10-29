// src/Hooks/useApi.js

import { useCallback, useMemo, useRef } from 'react';
import axios from 'axios';

const TEN_MINUTES = 60 * 10 * 1000;
const CACHE_EXPIRY = TEN_MINUTES;

const useApi = () => {
  const generateCacheKey = useCallback((endpoint) => `cache_${endpoint}`, []);

  const getJwtToken = useCallback(() => {
    return localStorage.getItem('accessToken');
  }, []);

  const getStoredNumber = useCallback(() => {
    const storedNumber = localStorage.getItem('storedNumber');
    return storedNumber ? parseInt(storedNumber, 10) : 0;
  }, []);

  const updateStoredNumber = useCallback(() => {
    let currentNumber = getStoredNumber();
    currentNumber += Math.floor(Math.random() * 3) + 1;

    if (currentNumber > 100) {
      currentNumber = 0;
    }

    localStorage.setItem('storedNumber', currentNumber);
    return currentNumber;
  }, [getStoredNumber]);

  const requestTimestamps = useRef([]);

  const blockFor = (milliseconds) => {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  };

  const get = useCallback(
    async (endpoint, config = {}) => {
      const { noCache, ...axiosConfig } = config;
      const cacheKey = generateCacheKey(endpoint);

      const now = Date.now();

      requestTimestamps.current = requestTimestamps.current.filter(
        (timestamp) => now - timestamp < 1000
      );

      if (requestTimestamps.current.length >= 5) {
        blockFor(800);
      }
      requestTimestamps.current.push(now);

      if (!noCache) {
        const cachedItem = JSON.parse(localStorage.getItem(cacheKey));

        if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRY) {
          console.log('Returning Cache');
          return cachedItem.data;
        }
      }

      try {
        const response = await axios.get(endpoint, {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });
        console.log('New Request');
        if (!noCache) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: response.data, timestamp: Date.now() })
          );
        }

        updateStoredNumber();

        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);

        if (error.response && error.response.status === 403) {
          // Clear user session data
          localStorage.removeItem('accessToken');
          localStorage.setItem('loginSuccessful', 'false');
          // Redirect to login page
          window.location.href = '/login';
        }

        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber]
  );

  const mutate = useCallback(
    async (method, endpoint, data = null, config = {}) => {
      const now = Date.now();

      requestTimestamps.current = requestTimestamps.current.filter(
        (timestamp) => now - timestamp < 1000
      );

      if (requestTimestamps.current.length >= 5) {
        blockFor(800);
      }

      requestTimestamps.current.push(now);

      try {
        const storedNumber = updateStoredNumber();
        const modifiedData = { ...data, storedNumber };

        const response = await axios({
          method,
          url: endpoint,
          data: modifiedData,
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });

        const cacheKey = generateCacheKey(endpoint);
        localStorage.removeItem(cacheKey);

        return response.data;
      } catch (error) {
        console.error(`Error with ${method} request:`, error);

        if (error.response && error.response.status === 403) {
          // Clear user session data
          localStorage.removeItem('accessToken');
          localStorage.setItem('loginSuccessful', 'false');
          // Redirect to login page
          window.location.href = '/login';
        }

        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber]
  );

  const apiMethods = useMemo(
    () => ({
      get,
      post: (endpoint, data, config) => mutate('POST', endpoint, data, config),
      put: (endpoint, data, config) => mutate('PUT', endpoint, data, config),
      patch: (endpoint, data, config) => mutate('PATCH', endpoint, data, config),
      delete: (endpoint, config) => mutate('DELETE', endpoint, null, config),
    }),
    [get, mutate]
  );

  return apiMethods;
};

export default useApi;
