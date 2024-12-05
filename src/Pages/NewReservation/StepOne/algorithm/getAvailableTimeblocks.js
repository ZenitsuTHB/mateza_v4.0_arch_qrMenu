// getAvailableTimeblocks.js

const { timeblocksAvailable } = require('./processing/timeblocksAvailable');

/**
 * Parses a time string in "HH:MM" format into a Date object on a specific date.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @param {string} timeZone - The IANA time zone identifier.
 * @returns {Date} Date object representing the time on the specified date and time zone.
 */
function parseDateTimeInTimeZone(dateStr, timeStr, timeZone) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a date object in the specified time zone
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  // Adjust to the target time zone
  const dateInTimeZone = new Date(
    date.toLocaleString('en-US', { timeZone: timeZone })
  );
  return dateInTimeZone;
}

/**
 * Gets the available time blocks or shifts for a reservation, considering the 'uurOpVoorhand' setting.
 * @param {Object} data - The main data object containing settings and meal information.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} guests - The number of guests for the reservation.
 * @returns {Object} - Returns a pruned object of available time blocks or shifts.
 */
function getAvailableTimeblocks(data, dateStr, reservations, guests) {
  // Get 'uurOpVoorhand' from general settings, default to 4 if not defined or zero
  let uurOpVoorhand = 4; // Default value in hours
  if (
    data['general-settings'] &&
    data['general-settings'].uurOpVoorhand &&
    parseInt(data['general-settings'].uurOpVoorhand, 10) >= 0
  ) {
    uurOpVoorhand = parseInt(data['general-settings'].uurOpVoorhand, 10);
  }

  // Time zone for CEST/CET (Europe/Amsterdam)
  const timeZone = 'Europe/Amsterdam';

  // Get the current date and time in the specified time zone
  const now = new Date();
  const currentTimeInTimeZone = new Date(
    now.toLocaleString('en-US', { timeZone: timeZone })
  );

  // Parse the target date in the specified time zone
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  const targetDateInTimeZone = new Date(
    targetDate.toLocaleString('en-US', { timeZone: timeZone })
  );

  // Check if the target date is today in the specified time zone
  const isToday =
    currentTimeInTimeZone.toDateString() === targetDateInTimeZone.toDateString();

  // Get available time blocks or shifts
  const availableTimeblocks = timeblocksAvailable(
    data,
    dateStr,
    reservations,
    guests
  );

  // If the date is today and uurOpVoorhand is greater than zero, prune time blocks
  if (isToday && uurOpVoorhand >= 0) {
    // Calculate the cutoff time
    const cutoffTime = new Date(currentTimeInTimeZone.getTime());
    cutoffTime.setHours(cutoffTime.getHours() + uurOpVoorhand);

    // Prune the available time blocks
    for (const [key, value] of Object.entries(availableTimeblocks)) {
      let timeStr;

      // Determine the time string based on whether it's a shift or regular time slot
      if (value.name) {
        // Shift
        timeStr = key; // Shift time is the key in timeblocksAvailable
      } else {
        // Regular time slot
        timeStr = key;
      }

      // Parse the time block's date and time in the specified time zone
      const timeBlockDateTime = parseDateTimeInTimeZone(
        dateStr,
        timeStr,
        timeZone
      );

      // If the time block is before the cutoff time, remove it
      if (timeBlockDateTime < cutoffTime) {
        delete availableTimeblocks[key];
      }
    }
  }

  return availableTimeblocks;
}

module.exports = {
  getAvailableTimeblocks,
};
