// src/components/Timeline/Hooks/useTimelineSettings.js

import { useMemo } from 'react';

const useTimelineSettings = (zoomLevel) => {
  return useMemo(() => {
    let hourInterval;
    let snappingIntervalMinutes;
    if (zoomLevel === 2) {
      hourInterval = 0.25; // 15 minutes
      snappingIntervalMinutes = 15;
    } else if (zoomLevel === 1) {
      hourInterval = 0.5; // 30 minutes
      snappingIntervalMinutes = 30;
    } else if (zoomLevel === 0.5) {
      hourInterval = 1; // 60 minutes
      snappingIntervalMinutes = 60;
    } else if (zoomLevel === 0.25) {
      hourInterval = 2; // 120 minutes
      snappingIntervalMinutes = 120;
    } else {
      hourInterval = 1; // Default to 60 minutes
      snappingIntervalMinutes = 60;
    }

    // Generate hours array
    const hours = [];
    for (let i = 0; i <= 24; i += hourInterval) {
      hours.push(i);
    }

    return { hourInterval, snappingIntervalMinutes, hours };
  }, [zoomLevel]);
};

export default useTimelineSettings;
