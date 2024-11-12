import moment from 'moment-timezone';

export const generateAvailableTimesForDate = (selectedDate) => {
  if (!selectedDate) {
    return [];
  }

  const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
  const timeEntries = window.dateDictionary[selectedDateStr];

  if (!timeEntries || timeEntries.length === 0) {
    return [];
  }

  const timesSet = new Set();
  const intervalMinutes = 30; // Adjust as needed

  timeEntries.forEach((entry) => {
    const startTime = moment(entry.startTime, 'HH:mm');
    const endTime = moment(entry.endTime, 'HH:mm');

    let currentTime = startTime.clone();
    while (currentTime.isBefore(endTime)) {
      const timeStr = currentTime.format('HH:mm');
      timesSet.add(timeStr);
      currentTime.add(intervalMinutes, 'minutes');
    }
  });

  const times = Array.from(timesSet)
    .sort((a, b) => moment(a, 'HH:mm') - moment(b, 'HH:mm'))
    .map((timeStr) => ({
      label: timeStr,
      value: timeStr,
    }));

  return times;
};
