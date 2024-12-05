// timeblocksAvailable.js

const { getDailyGuestCounts } = require('./dailyGuestCounts');
const { getMealTypesWithShifts } = require('./mealTypeCount');

/**
 * Parses a time string in "HH:MM" format into minutes since midnight.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @returns {number} Minutes since midnight.
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Finds available time blocks or shifts for a reservation of a specified number of guests.
 * @param {Object} data - The main data object containing settings and meal information.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} guests - The number of guests for the reservation.
 * @returns {Object} - Returns an object of available time blocks or shifts.
 */
function timeblocksAvailable(data, dateStr, reservations, guests) {
  // Get 'duurReservatie' and 'intervalReservatie' from general settings
  let duurReservatie = 120; // Default duration in minutes
  let intervalReservatie = 15; // Default interval in minutes

  if (
    data['general-settings'] &&
    data['general-settings'].duurReservatie &&
    parseInt(data['general-settings'].duurReservatie, 10) > 0
  ) {
    duurReservatie = parseInt(data['general-settings'].duurReservatie, 10);
  }

  if (
    data['general-settings'] &&
    data['general-settings'].intervalReservatie &&
    parseInt(data['general-settings'].intervalReservatie, 10) > 0
  ) {
    intervalReservatie = parseInt(data['general-settings'].intervalReservatie, 10);
  }

  // Calculate the number of consecutive slots needed
  const slotsNeeded = Math.ceil(duurReservatie / intervalReservatie);

  // Get the combined guest counts for the date, including shift information
  const { guestCounts, shiftsInfo } = getDailyGuestCounts(data, dateStr, reservations);

  const availableTimeblocks = {};

  // Check if any meal has shifts enabled
  const mealTypesWithShifts = getMealTypesWithShifts(data, dateStr);

  // If any meal has shifts, handle shifts separately
  if (mealTypesWithShifts.length > 0 && shiftsInfo && shiftsInfo.length > 0) {
    // For each shift, check if there is enough capacity
    for (const shift of shiftsInfo) {
      const { time, availableSeats, shiftName, mealType } = shift;
      if (availableSeats >= guests) {
        // Include shift info in the output
        availableTimeblocks[time] = {
          name: shiftName,
        };
      }
    }
  }

  // For meals without shifts, apply consecutive slots rule
  if (guestCounts && Object.keys(guestCounts).length > 0) {
    const timeSlots = Object.keys(guestCounts).sort((a, b) => {
      const timeA = parseTime(a);
      const timeB = parseTime(b);
      return timeA - timeB;
    });

    // Go through the time slots to find sequences of consecutive slots with enough available seats
    for (let i = 0; i <= timeSlots.length - slotsNeeded; i++) {
      let consecutiveSlotsAvailable = true;

      // Check if the current time slot has enough available seats
      if (guestCounts[timeSlots[i]] < guests) {
        continue;
      }

      // Start time of the current slot
      let previousTime = parseTime(timeSlots[i]);

      // Check subsequent slots for consecutiveness and availability
      for (let j = 1; j < slotsNeeded; j++) {
        const currentTimeSlot = timeSlots[i + j];
        const currentTime = parseTime(currentTimeSlot);
        const timeDifference = currentTime - previousTime;

        // Check if the time difference is equal to 'intervalReservatie'
        if (timeDifference !== intervalReservatie) {
          consecutiveSlotsAvailable = false;
          break;
        }

        // Check if the current slot has enough available seats
        if (guestCounts[currentTimeSlot] < guests) {
          consecutiveSlotsAvailable = false;
          break;
        }

        // Update for next iteration
        previousTime = currentTime;
      }

      if (consecutiveSlotsAvailable) {
        // Add the starting time slot into availableTimeblocks
        availableTimeblocks[timeSlots[i]] = {
          name: timeSlots[i],
        };
      }
    }
  }

  return availableTimeblocks;
}

module.exports = {
  timeblocksAvailable,
};
