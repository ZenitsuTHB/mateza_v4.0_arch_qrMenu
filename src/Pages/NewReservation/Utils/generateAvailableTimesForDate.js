// src/components/ReservationForm/Utils/generateAvailableTimesForDate.js

import moment from 'moment-timezone';

export const generateAvailableTimesForDate = (selectedDate, timeblocks) => {
    if (!selectedDate) {
        return [];
    }

    const selectedDateStr = moment(selectedDate).format('YYYY-MM-DD');
    const timeEntries = window.dateDictionary[selectedDateStr];

    if (!timeEntries || timeEntries.length === 0) {
        return [];
    }

    const times = [];
    const intervalMinutes = 30; // Adjust as needed

    timeEntries.forEach((entry) => {
        const startTime = moment(entry.startTime, 'HH:mm');
        const endTime = moment(entry.endTime, 'HH:mm');

        let currentTime = startTime.clone();
        while (currentTime.isBefore(endTime)) {
            times.push({
                label: currentTime.format('HH:mm'),
                value: currentTime.format('HH:mm'),
            });
            currentTime.add(intervalMinutes, 'minutes');
        }
    });

    return times;
};
