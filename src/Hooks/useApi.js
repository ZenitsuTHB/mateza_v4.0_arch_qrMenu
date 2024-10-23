// src/Hooks/useApi.js

import { useCallback, useMemo } from 'react';
import axios from 'axios';

const TEN_MINUTES = 60 * 10 * 1000; // 10 minutes in milliseconds
const CACHE_EXPIRY = TEN_MINUTES;

const useApi = () => {
  // Generates a unique cache key based on the endpoint
  const generateCacheKey = useCallback((endpoint) => `cache_${endpoint}`, []);

  // Retrieves JWT token from localStorage
  const getJwtToken = useCallback(() => {
    return localStorage.getItem('accessToken');
  }, []);

  // Retrieves stored number from localStorage
  const getStoredNumber = useCallback(() => {
    const storedNumber = localStorage.getItem('storedNumber');
    return storedNumber ? parseInt(storedNumber, 10) : 0;
  }, []);

  // Updates the stored number in localStorage
  const updateStoredNumber = useCallback(() => {
    let currentNumber = getStoredNumber();
    currentNumber += Math.floor(Math.random() * 3) + 1;

    if (currentNumber > 100) {
      currentNumber = 0;
    }

    localStorage.setItem('storedNumber', currentNumber);
    return currentNumber;
  }, [getStoredNumber]);

  // GET method with optional caching
  const get = useCallback(
    async (endpoint, config = {}) => {
      const { noCache, ...axiosConfig } = config; // Destructure noCache from config
      const cacheKey = generateCacheKey(endpoint);

      // If caching is not disabled, attempt to retrieve data from cache
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

        // If caching is not disabled, store the response in cache
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
        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber]
  );

  // Mutating methods (POST, PUT, PATCH, DELETE)
  const mutate = useCallback(
    async (method, endpoint, data = null, config = {}) => {
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
        localStorage.removeItem(cacheKey); // Invalidate cache for the endpoint

        return response.data;
      } catch (error) {
        console.error(`Error with ${method} request:`, error);
        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber]
  );

  // Memoize API methods to prevent unnecessary re-renders
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
