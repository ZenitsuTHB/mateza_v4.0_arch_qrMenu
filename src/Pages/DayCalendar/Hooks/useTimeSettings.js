// src/components/Timeline/Hooks/useTimelineSettings.js

import { useMemo } from 'react';

const useTimelineSettings = (zoomLevel) => {
  return useMemo(() => {
    let hourInterval;
    let snappingIntervalMinutes;
    if (zoomLevel === 2) {
      hourInterval = 0.25;
      snappingIntervalMinutes = 15;
    } else if (zoomLevel === 1) {
      hourInterval = 0.5;
      snappingIntervalMinutes = 30;
    } else if (zoomLevel === 0.5) {
      hourInterval = 1;
      snappingIntervalMinutes = 60;
    } else if (zoomLevel === 0.25) {
      hourInterval = 2;
      snappingIntervalMinutes = 120;
    } else {
      hourInterval = 1;
      snappingIntervalMinutes = 60;
    }

    const hours = [];
    for (let i = 0; i <= 24; i += hourInterval) {
      hours.push(i);
    }

    return { hourInterval, snappingIntervalMinutes, hours };
  }, [zoomLevel]);
};

export default useTimelineSettings;
