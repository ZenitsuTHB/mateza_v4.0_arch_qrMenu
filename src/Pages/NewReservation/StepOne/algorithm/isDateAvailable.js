// isDateAvailable.js

const { getDailyGuestCounts } = require('./processing/dailyGuestCounts');
const { getDataByDateAndMealWithExceptions } = require('./restaurant_data/exceptions');
const { getMealTypesWithShifts } = require('./processing/mealTypeCount');

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
 * Checks if a date is available for a reservation of a specified number of guests.
 * @param {Object} data - The main data object containing settings and meal information.
 * @param {string} dateStr - The date string in "YYYY-MM-DD" format.
 * @param {Array} reservations - An array of reservation objects.
 * @param {number} guests - The number of guests for the reservation.
 * @returns {boolean} - Returns true if the date is available, false otherwise.
 */
function isDateAvailable(data, dateStr, reservations, guests) {
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

  // Check if any meal has shifts enabled
  const mealTypesWithShifts = getMealTypesWithShifts(data, dateStr);

  // If any meal has shifts, handle shifts separately
  if (mealTypesWithShifts.length > 0) {
    // For each shift, check if there is enough capacity
    for (const shift of shiftsInfo) {
      const { time, availableSeats } = shift;
      if (availableSeats >= guests) {
        return true; // Found a shift with enough capacity
      }
    }
  }

  // If no shifts or no available shifts, proceed with consecutive slots rule
  const timeSlots = Object.keys(guestCounts).sort((a, b) => {
    const timeA = parseTime(a);
    const timeB = parseTime(b);
    return timeA - timeB;
  });

  // Iterate through the time slots to find consecutive slots with enough available seats
  for (let i = 0; i < timeSlots.length; i++) {
    let consecutiveSlotsAvailable = true;
    let consecutiveSlotsCount = 1;

    // Check if the current time slot has enough available seats
    if (guestCounts[timeSlots[i]] < guests) {
      continue;
    }

    // Start time of the current slot
    let previousTime = parseTime(timeSlots[i]);

    // Check subsequent slots for consecutiveness and availability
    for (let j = i + 1; j < timeSlots.length && consecutiveSlotsCount < slotsNeeded; j++) {
      const currentTime = parseTime(timeSlots[j]);
      const timeDifference = currentTime - previousTime;

      // Check if the time difference is equal to 'intervalReservatie'
      if (timeDifference !== intervalReservatie) {
        consecutiveSlotsAvailable = false;
        break;
      }

      // Check if the current slot has enough available seats
      if (guestCounts[timeSlots[j]] < guests) {
        consecutiveSlotsAvailable = false;
        break;
      }

      // Update for next iteration
      consecutiveSlotsCount++;
      previousTime = currentTime;
    }

    if (consecutiveSlotsAvailable && consecutiveSlotsCount === slotsNeeded) {
      return true; // Found a sequence of slots with enough available seats
    }
  }

  return false; // No suitable sequence found
}

module.exports = {
  isDateAvailable,
};
