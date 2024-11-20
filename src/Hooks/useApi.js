// src/Hooks/useApi.js

import { useCallback, useMemo, useRef } from 'react';
import axios from 'axios';

const TEN_MINUTES = 60 * 10 * 1000;
const CACHE_EXPIRY = TEN_MINUTES;

const useApi = () => {
  const isProduction = window.isProduction === true;

  const log = useCallback((...args) => {
    if (!isProduction) {
      console.log(...args);
    }
  }, [isProduction]);

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
          log('Returning Cache for:', endpoint, cachedItem);
          return cachedItem.data;
        }
      }

      try {
        log('Making GET request to:', endpoint, 'with config:', axiosConfig);
        const response = await axios.get(endpoint, {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });
        log(
          'Received response for GET:',
          endpoint,
          'Status:',
          response.status,
          'Data:',
          response.data
        );

        if (!noCache) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: response.data, timestamp: Date.now() })
          );
          log('Cached response for:', endpoint);
        }

        updateStoredNumber();

        return response.data;
      } catch (error) {
        log('Error fetching data from GET:', endpoint, 'Error:', error);
        console.error('Error fetching data:', error);

        if (error.response && error.response.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.setItem('loginSuccessful', 'false');
          log('403 Forbidden: Redirecting to login.');
          window.location.href = '/login';
        }

        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber, log]
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
        let modifiedData;

        if (data instanceof FormData) {
          modifiedData = data;
          // **Removed:** Do not append storedNumber to FormData
          // If your server expects storedNumber, handle it differently
        } else {
          modifiedData = { ...data, storedNumber };
        }

        log(
          `${method} request to:`,
          endpoint,
          'Data:',
          modifiedData,
          'Config:',
          config
        );

        // Determine the Content-Type
        let contentType = config.headers?.['Content-Type'];
        if (!contentType) {
          if (modifiedData instanceof FormData) {
            // Let Axios set the Content-Type for FormData
            contentType = undefined;
          } else {
            // Default to 'application/json' for other data types
            contentType = 'application/json';
          }
        }

        const response = await axios({
          method,
          url: endpoint,
          data: modifiedData,
          ...config,
          headers: {
            ...config.headers,
            ...(contentType && { 'Content-Type': contentType }),
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });

        log(
          `Received response for ${method}:`,
          endpoint,
          'Status:',
          response.status,
          'Data:',
          response.data
        );

        const cacheKey = generateCacheKey(endpoint);
        localStorage.removeItem(cacheKey);
        log('Cleared cache for:', endpoint);

        return response.data;
      } catch (error) {
        log(`Error with ${method} request to:`, endpoint, 'Error:', error);
        console.error(`Error with ${method} request:`, error);

        if (error.response && error.response.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.setItem('loginSuccessful', 'false');
          log(`${method} 403 Forbidden: Redirecting to login.`);
          window.location.href = '/login';
        }

        throw error;
      }
    },
    [generateCacheKey, getJwtToken, updateStoredNumber, log]
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
