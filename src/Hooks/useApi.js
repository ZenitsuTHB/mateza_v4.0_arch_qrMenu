// src/Hooks/useApi.js

import { useCallback } from 'react';
import axios from 'axios';

const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

const useApi = () => {
  // Helper function to generate cache keys
  const generateCacheKey = useCallback((endpoint) => `cache_${endpoint}`, []);

  // Function to retrieve JWT token
  const getJwtToken = useCallback(() => {
    // Implement your logic to retrieve the JWT token
    // For example, from localStorage:
    return localStorage.getItem('jwtToken');
  }, []);

  // Function to get data (with caching)
  const get = useCallback(
    async (endpoint, config = {}) => {
      const cacheKey = generateCacheKey(endpoint);
      const cachedItem = JSON.parse(localStorage.getItem(cacheKey));

      // Check if cached data is available and valid
      if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRY) {
        console.log('Returning Cache');
        return cachedItem.data;
      }

      // Make the GET request
      try {
        const response = await axios.get(endpoint, {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });

        console.log('New Request');

        // Update cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );

        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    [generateCacheKey, getJwtToken]
  );

  // Function to handle POST, PUT, PATCH, DELETE requests
  const mutate = useCallback(
    async (method, endpoint, data = null, config = {}) => {
      try {
        const response = await axios({
          method,
          url: endpoint,
          data,
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${getJwtToken()}`,
          },
        });

        // Invalidate cache
        const cacheKey = generateCacheKey(endpoint);
        localStorage.removeItem(cacheKey);

        return response.data;
      } catch (error) {
        console.error(`Error with ${method} request:`, error);
        throw error;
      }
    },
    [generateCacheKey, getJwtToken]
  );

  // Return memoized API methods
  return {
    get,
    post: useCallback(
      (endpoint, data, config) => mutate('POST', endpoint, data, config),
      [mutate]
    ),
    put: useCallback(
      (endpoint, data, config) => mutate('PUT', endpoint, data, config),
      [mutate]
    ),
    patch: useCallback(
      (endpoint, data, config) => mutate('PATCH', endpoint, data, config),
      [mutate]
    ),
    delete: useCallback(
      (endpoint, config) => mutate('DELETE', endpoint, null, config),
      [mutate]
    ),
  };
};

export default useApi;
