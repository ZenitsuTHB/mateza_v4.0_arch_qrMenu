// Calendar/generateDates.js

import { DateTime } from 'luxon';

const getOrInitializeArray = (dict, key) => {
    if (!Array.isArray(dict[key])) {
        dict[key] = [];
    }
    return dict[key];
};

const initializeDictionaries = () => {
    window.dateDictionary = window.dateDictionary || {};
    window.shiftsPerDate = window.shiftsPerDate || {};
};

const processTimeblock = (block) => {
    if (!block.date) {
        return;
    }

    const dateString = DateTime.fromISO(block.date, { zone: "Europe/Brussels" }).toISODate();

    if (!window.dateDictionary[dateString]) {
        window.dateDictionary[dateString] = [];
    }
    window.dateDictionary[dateString].push({
        startTime: block.startTime || null,
        endTime: block.endTime || null
    });

    if (block.shifts && Array.isArray(block.shifts) && block.shifts.length > 0) {
        const shiftsArray = getOrInitializeArray(window.shiftsPerDate, dateString);

        block.shifts.forEach(shift => {
            const exists = shiftsArray.some(existingShift => 
                existingShift.name === shift.name && existingShift.startTime === shift.startTime
            );
            if (!exists) {
                shiftsArray.push({
                    name: shift.name || '',
                    startTime: shift.startTime || '',
                    endTime: shift.endTime || null
                });
            }
        });
    }
};

const getBlockSettingsDates = (timeblocks) => {
    initializeDictionaries();
    const dates = [];

    timeblocks.forEach((block) => {
        processTimeblock(block);
        if (block.date) {
            const dateString = DateTime.fromISO(block.date, { zone: "Europe/Brussels" }).toISODate();
            dates.push(dateString);
        }
    });

    return dates;
};

const isWithinPeriod = (currentDate, endDate) => {
    return currentDate <= endDate;
};

const processDaySetting = (dateString, daySetting) => {
    if (!window.dateDictionary[dateString]) {
        window.dateDictionary[dateString] = [];
    }
    window.dateDictionary[dateString].push({
        startTime: daySetting.startTime || null,
        endTime: daySetting.endTime || null,
    });

    if (daySetting.shiftsEnabled && Array.isArray(daySetting.shifts) && daySetting.shifts.length > 0) {
        console.log(`[processDaySetting] Processing shifts for ${dateString}`);
        const shiftsArray = getOrInitializeArray(window.shiftsPerDate, dateString);

        daySetting.shifts.forEach(shift => {
            const exists = shiftsArray.some(existingShift => 
                existingShift.name === shift.name && existingShift.startTime === shift.startTime
            );
            if (!exists) {
                shiftsArray.push({
                    name: shift.name || '',
                    startTime: shift.startTime || '',
                    endTime: shift.endTime || null
                });
            }
        });
    }
};

const getSchemeSettingsDates = (timeblocks) => {
    console.log(`[getSchemeSettingsDates] Starting processing of scheme settings dates.`);
    initializeDictionaries();
    const dates = [];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    timeblocks.forEach((block) => {
        if (!block.schemeSettings) {
            return;
        }

        const { schemeSettings } = block;
        let currentDate = DateTime.now().setZone("Europe/Brussels").startOf('day');
        let endDate = currentDate.plus({ days: 365 }).startOf('day');

        if (schemeSettings.period && schemeSettings.period.enabled) {
            const { startDate, endDate: periodEndDate } = schemeSettings.period;
            if (startDate && periodEndDate) {
                currentDate = DateTime.fromISO(startDate, { zone: "Europe/Brussels" }).startOf('day');
                endDate = DateTime.fromISO(periodEndDate, { zone: "Europe/Brussels" }).endOf('day');
            }
        }

        while (isWithinPeriod(currentDate, endDate)) {
            const dayOfWeek = currentDate.weekday % 7;
            const dayName = dayNames[dayOfWeek];
            const daySetting = schemeSettings[dayName];
            if (daySetting && daySetting.enabled) {
                const dateString = currentDate.toISODate();
                dates.push(dateString);
                processDaySetting(dateString, daySetting);
            }

            currentDate = currentDate.plus({ days: 1 });
        }
    });
    return dates;
};

export const generateAvailableDates = (timeblocks) => {
    initializeDictionaries();

    const blockDates = getBlockSettingsDates(timeblocks);
    const schemeDates = getSchemeSettingsDates(timeblocks);
    const combinedDates = [...blockDates, ...schemeDates];
    const uniqueDates = Array.from(new Set(combinedDates)).sort();
    return uniqueDates;
};
