// utils/dateUtils.js

/**
 * Formats a Date object to 'YYYY-MM-DD' string.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string.
 */
export const formatDateForFilter = (date) => {
	if (!date) return '';
	const year = date.getFullYear();
	const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-based
	const day = (`0${date.getDate()}`).slice(-2);
	return `${year}-${month}-${day}`;
  };
  
  /**
   * Formats a Date object into a Dutch date string (e.g., '19 oktober 2024').
   * @param {Date} date - The date to format.
   * @returns {string} Formatted date string in Dutch.
   */
  export const formatDateDutch = (date) => {
	if (!date) return '';
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	return date.toLocaleDateString('nl-NL', options);
  };
  
  /**
   * Checks if a given date is today.
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is today, else false.
   */
  export const isToday = (date) => {
	const today = new Date();
	return (
	  date.getDate() === today.getDate() &&
	  date.getMonth() === today.getMonth() &&
	  date.getFullYear() === today.getFullYear()
	);
  };
  
  /**
   * Converts a time string in "HH:MM" format to total minutes.
   * @param {string} timeStr - Time string in "HH:MM" format.
   * @returns {number} Total minutes.
   */
  export const timeToMinutes = (timeStr) => {
	if (!timeStr) return 0;
	const [hours, minutes] = timeStr.split(':').map(Number);
	return hours * 60 + minutes;
  };
  