// index.js

const daysOfWeekEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysOfWeekDutch = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

const shifts = {
  breakfast: { start: '07:00', end: '11:00' },
  lunch: { start: '11:00', end: '16:00' },
  dinner: { start: '16:00', end: '23:00' },
};

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
 * Determines the meal type based on the provided time.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @returns {string|null} The meal type ("breakfast", "lunch", "dinner") or null if none match.
 */
function getMealTypeByTime(timeStr) {
  const time = parseTime(timeStr);
  for (const [mealType, shift] of Object.entries(shifts)) {
    const start = parseTime(shift.start);
    const end = parseTime(shift.end);
    if (time >= start && time < end) {
      return mealType;
    }
  }
  return null;
}

/**
 * Retrieves meal data for a specific day of the week and meal type.
 * @param {Object} data - The input data object.
 * @param {string} dayOfWeek - Day of the week in English (e.g., "Monday").
 * @param {string} mealType - Meal type ("breakfast", "lunch", "dinner").
 * @returns {Object|null} The meal data or null if not found.
 */
function getDataByDayAndMeal(data, dayOfWeek, mealType) {
  const mealKey = `openinghours-${mealType}`;
  if (!data[mealKey]) {
    return null;
  }
  const mealData = data[mealKey];
  const dayData = mealData.schemeSettings[dayOfWeek];
  if (!dayData) {
    return null;
  }
  return { ...dayData }; // Return a shallow copy to avoid mutating original data
}

/**
 * Adjusts meal data to use general settings if maxCapacityEnabled is false.
 * @param {Object} mealData - The meal data object to adjust.
 * @param {Object} generalSettings - The general settings object.
 */
function adjustMealData(mealData, generalSettings) {
  if (mealData.maxCapacityEnabled === false) {
    // Fallback to general-settings.zitplaatsen
    if (generalSettings && generalSettings.zitplaatsen) {
      mealData.maxCapacity = generalSettings.zitplaatsen;
      mealData.maxCapacityEnabled = true;
    } else {
      // If zitplaatsen is not set, set maxCapacity to 0
      mealData.maxCapacity = '0';
      mealData.maxCapacityEnabled = true;
    }
  }
}

/**
 * Retrieves meal data based on a date and meal type.
 * Returns null if the meal is not enabled.
 * @param {Object} data - The input data object.
 * @param {string} dateStr - Date string in "YYYY-MM-DD" format.
 * @param {string} mealType - Meal type ("breakfast", "lunch", "dinner").
 * @returns {Object|null} The meal data or null if not enabled/not found.
 */
function getDataByDateAndMeal(data, dateStr, mealType) {
  const date = new Date(dateStr);
  if (isNaN(date)) {
    // Invalid date
    return null;
  }
  const dayOfWeekIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const dayOfWeek = daysOfWeekEnglish[dayOfWeekIndex];
  let mealData = getDataByDayAndMeal(data, dayOfWeek, mealType);
  if (!mealData || mealData.enabled !== true) {
    return null;
  }

  // Adjust mealData if maxCapacityEnabled is false
  adjustMealData(mealData, data['general-settings']);

  return mealData;
}

/**
 * Retrieves meal data based on a date and time.
 * Returns null if the meal is not enabled or the time is outside operating hours.
 * @param {Object} data - The input data object.
 * @param {string} dateStr - Date string in "YYYY-MM-DD" format.
 * @param {string} timeStr - Time string in "HH:MM" format.
 * @returns {Object|null} The meal data or null if not enabled/not found/outside operating hours.
 */
function getDataByDateAndTime(data, dateStr, timeStr) {
  const mealType = getMealTypeByTime(timeStr);
  if (!mealType) {
    return null;
  }
  const mealData = getDataByDateAndMeal(data, dateStr, mealType);
  if (!mealData) {
    return null;
  }
  const requestedTime = parseTime(timeStr);
  const startTime = parseTime(mealData.startTime);
  const endTime = parseTime(mealData.endTime);
  // Check if requested time is within the mealData's start and end times
  if (requestedTime >= startTime && requestedTime < endTime) {
    return mealData;
  } else {
    return null;
  }
}

module.exports = {
  getDataByDayAndMeal,
  getDataByDateAndMeal,
  getDataByDateAndTime,
  daysOfWeekEnglish,
  daysOfWeekDutch,
  getMealTypeByTime,
  parseTime,
  shifts,
};
