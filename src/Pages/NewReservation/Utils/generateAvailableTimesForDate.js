// src/components/ReservationForm/Utils/generateAvailableTimesForDate.js

import moment from 'moment';

export const generateAvailableTimesForDate = (selectedDate, timeblocks) => {
  if (!selectedDate) {
    return [];
  }
  const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
  const block = timeblocks.find((tb) => tb.date === selectedDateStr);
  if (!block) {
    return [];
  }
  const startTime = moment(block.startTime, 'HH:mm');
  const endTime = moment(block.endTime, 'HH:mm');
  const times = [];
  const intervalMinutes = 30;
  let currentTime = startTime.clone();
  while (currentTime.isBefore(endTime)) {
    times.push({
      label: currentTime.format('HH:mm'),
      value: currentTime.format('HH:mm'),
    });
    currentTime.add(intervalMinutes, 'minutes');
  }
  return times;
};
