// exceptions.js

const {
	getDataByDateAndMeal,
	getDataByDateAndTime,
	getMealTypeByTime,
	parseTime,
	shifts,
	daysOfWeekEnglish,
	daysOfWeekDutch,
  } = require('./openinghours');
  
  /**
   * Checks if a given date falls within a date range.
   * @param {string} dateStr - The date to check (YYYY-MM-DD).
   * @param {string} startDateStr - The start date of the range (YYYY-MM-DD).
   * @param {string} endDateStr - The end date of the range (YYYY-MM-DD).
   * @returns {boolean} True if date is within the range (inclusive), else false.
   */
  function isDateInRange(dateStr, startDateStr, endDateStr) {
	const date = new Date(dateStr);
	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);
	if (isNaN(date) || isNaN(startDate) || isNaN(endDate)) {
	  return false;
	}
	return date >= startDate && date <= endDate;
  }
  
  /**
   * Converts a date to a day of the week in Dutch.
   * @param {Date} date - The date object.
   * @returns {string} The day of the week in Dutch.
   */
  function getDutchDayOfWeek(date) {
	const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
	return daysOfWeekDutch[dayIndex];
  }
  
  /**
   * Checks if an exception applies to the given date, day of week, and meal type.
   * @param {Object} exception - The exception object.
   * @param {string} dateStr - The date string (YYYY-MM-DD).
   * @param {string} dateDayOfWeekDutch - The day of week in Dutch (e.g., 'maandag').
   * @param {string} mealType - The meal type ('breakfast', 'lunch', 'dinner').
   * @returns {boolean} True if the exception applies, false otherwise.
   */
  function doesExceptionApply(exception, dateStr, dateDayOfWeekDutch, mealType) {
	const { timeframe, startDate, endDate, daysOfWeek } = exception;
  
	// Check if date is within the exception date range
	if (!isDateInRange(dateStr, startDate, endDate)) {
	  return false;
	}
  
	// Check if daysOfWeek is specified and if date's day of week matches
	if (Array.isArray(daysOfWeek) && daysOfWeek.length > 0) {
	  const daysOfWeekLower = daysOfWeek.map(day => day.toLowerCase());
	  if (!daysOfWeekLower.includes(dateDayOfWeekDutch)) {
		return false;
	  }
	}
  
	// Check if the exception timeframe applies to the mealType
	if (timeframe === 'Volledige Dag' || timeframe === mealType) {
	  return true;
	}
  
	return false;
  }
  
  /**
   * Maps an exception object to the meal data format.
   * @param {Object} exception - The exception object.
   * @returns {Object} The meal data object.
   */
  function mapExceptionToMealData(exception) {
	return {
	  enabled: true,
	  startTime: exception.startHour,
	  endTime: exception.endHour,
	  maxCapacityEnabled: exception.maxSeats ? true : false,
	  maxCapacity: exception.maxSeats || null,
	  shiftsEnabled: false,
	  shifts: [],
	};
  }
  
  /**
   * Handles exceptions for getDataByDateAndMeal.
   * @param {Object} data - The main data object.
   * @param {string} dateStr - The date string (YYYY-MM-DD).
   * @param {string} mealType - The meal type ("breakfast", "lunch", "dinner").
   * @returns {Object|null} The meal data or null if an exception applies.
   */
  function getDataByDateAndMealWithExceptions(data, dateStr, mealType) {
	const exceptions = data.exceptions || [];
	const date = new Date(dateStr);
	if (isNaN(date)) {
	  return null;
	}
	const dateDayOfWeekDutch = getDutchDayOfWeek(date).toLowerCase();
  
	// Process exceptions in priority order
	const exceptionTypesPriority = ['Opening', 'Sluiting', 'Uitzondering'];
  
	for (const exceptionType of exceptionTypesPriority) {
	  for (const exception of exceptions) {
		if (exception.type === exceptionType) {
		  if (doesExceptionApply(exception, dateStr, dateDayOfWeekDutch, mealType)) {
			if (exceptionType === 'Sluiting') {
			  // Meal is closed
			  return null;
			} else {
			  // For 'Opening' and 'Uitzondering', return the exception's meal data
			  return mapExceptionToMealData(exception);
			}
		  }
		}
	  }
	}
  
	// If no exceptions apply, proceed to get the data as usual
	return getDataByDateAndMeal(data, dateStr, mealType);
  }
  
  /**
   * Handles exceptions for getDataByDateAndTime.
   * @param {Object} data - The main data object.
   * @param {string} dateStr - The date string (YYYY-MM-DD).
   * @param {string} timeStr - The time string (HH:MM).
   * @returns {Object|null} The meal data or null if an exception applies.
   */
  function getDataByDateAndTimeWithExceptions(data, dateStr, timeStr) {
	// Determine the mealType based on time
	const mealType = getMealTypeByTime(timeStr);
	if (!mealType) {
	  return null;
	}
	const mealData = getDataByDateAndMealWithExceptions(data, dateStr, mealType);
	if (!mealData) {
	  return null;
	}
  
	// Check if the time falls within the mealData's operating hours
	const requestedTime = parseTime(timeStr);
	const startTime = parseTime(mealData.startTime);
	const endTime = parseTime(mealData.endTime);
  
	if (requestedTime >= startTime && requestedTime < endTime) {
	  return mealData;
	} else {
	  return null;
	}
  }
  
  module.exports = {
	getDataByDateAndMealWithExceptions,
	getDataByDateAndTimeWithExceptions,
  };
  