// Utils/exceptions.js

import { DateTime } from 'luxon';

export const collectExceptions = (timeblocks) => {
    window.closedDates = new Set();
    window.exceptionalOpenings = {};

    timeblocks.forEach((block) => {
        if (!block.exceptionalDays) {
            return;
        }

        const { exceptionalDays } = block;

        // Process sluitingsperiode (closing periods)
        if (Array.isArray(exceptionalDays.sluitingsperiode)) {
            exceptionalDays.sluitingsperiode.forEach((period) => {
                if (period.enabled) {
                    const { startDate, endDate } = period;
                    if (startDate && endDate) {
                        let currentDate = DateTime.fromISO(startDate, { zone: "Europe/Brussels" }).startOf('day');
                        const endDateObj = DateTime.fromISO(endDate, { zone: "Europe/Brussels" }).startOf('day');
                        while (currentDate <= endDateObj) {
                            const dateString = currentDate.toISODate();
                            window.closedDates.add(dateString);
                            console.log(`[collectExceptions] Adding ${dateString} to closedDates due to sluitingsperiode.`);
                            currentDate = currentDate.plus({ days: 1 });
                        }
                    }
                }
            });
        }
        // Process uitzonderlijkeOpeningsuren (exceptional opening hours)
        if (Array.isArray(exceptionalDays.uitzonderlijkeOpeningsuren)) {
            exceptionalDays.uitzonderlijkeOpeningsuren.forEach((opening) => {
                if (opening.enabled) {
                    const { date, startTime, endTime } = opening;
                    if (date && startTime && endTime) {
                        window.exceptionalOpenings[date] = {
                            startTime,
                            endTime,
                        };
                        console.log(`[collectExceptions] Adding exceptional opening for ${date}: ${startTime} - ${endTime}`);
                    }
                }
            });
        }
    });
};