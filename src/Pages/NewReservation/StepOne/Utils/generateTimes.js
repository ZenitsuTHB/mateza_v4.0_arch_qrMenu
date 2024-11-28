// generateTimes.js

import { DateTime } from 'luxon';

const formatDateKey = (date) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();
    return formattedDate;
};

export const generateAvailableTimesForDate = (guests, selectedDate) => {
    const dateDictionary = window.dateDictionary;
    const shiftsPerDate = window.shiftsPerDate;
    const dateKey = formatDateKey(selectedDate);
    
    // Retrieve intervalReservatie and validate it
    const intervalReservatie = window.generalSettings?.intervalReservatie;
    let intervalMinutes = 30; // Default value

    if (
        typeof intervalReservatie === 'number' &&
        Number.isInteger(intervalReservatie) &&
        intervalReservatie > 0
    ) {
        intervalMinutes = intervalReservatie;
    } else {
        console.warn(
            `[generateAvailableTimesForDate] Invalid intervalReservatie value "${intervalReservatie}". Using default intervalMinutes = 30`
        );
    }

    if (!dateDictionary[dateKey] || dateDictionary[dateKey].length === 0) {
        return [];
    }

    const shiftData =
        shiftsPerDate && Array.isArray(shiftsPerDate[dateKey]) ? shiftsPerDate[dateKey] : [];

    let timeButtons = [];

    if (shiftData.length > 0) {
        timeButtons = shiftData.map((shift) => ({
            label: shift.name,
            value: shift.startTime,
        }));
    } else {
        const times = [];

        dateDictionary[dateKey].forEach(({ startTime, endTime }) => {

            let startDateTime = DateTime.fromFormat(startTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            });

            const endDateTime = DateTime.fromFormat(endTime, 'HH:mm', { zone: "Europe/Brussels" }).set({
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            });

            while (startDateTime < endDateTime) {
                    const timeString = startDateTime.toFormat('HH:mm');
                    times.push(timeString);
                
                startDateTime = startDateTime.plus({ minutes: intervalMinutes });
            }
        });

        const uniqueTimes = [...new Set(times)].sort(
            (a, b) => DateTime.fromFormat(a, 'HH:mm') - DateTime.fromFormat(b, 'HH:mm')
        );

        timeButtons = uniqueTimes.map((time) => ({
            label: time,
            value: time,
        }));
    }

    // Filter timeButtons based on countingDictionary
    const capacityLimit = window.generalSettings?.zitplaatsen || 0;
    const countingDictionary = window.countingDictionary || {};

    if (countingDictionary[dateKey]) {
        timeButtons = timeButtons.filter(button => {
            const time = button.value;
            const guestsCount = countingDictionary[dateKey][time] || 0;

            console.log("CALCULATION")
            console.log(guestsCount);
            console.log(guests);
            console.log("SELECTED: " + guests);
            console.log(capacityLimit);
            
            return (guestsCount + guests) <= capacityLimit;
        });
    }

    return timeButtons;
};
