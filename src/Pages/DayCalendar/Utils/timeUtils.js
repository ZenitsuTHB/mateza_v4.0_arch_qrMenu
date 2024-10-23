// src/utils/timeUtils.js

export const parseTime = (timeString) => {
	const [hours, minutes] = timeString.split(':').map(Number);
	return hours * 60 + minutes;
  };
  
  export const formatMinutesToTime = (totalMinutes) => {
	let hours = Math.floor(totalMinutes / 60);
	let minutes = totalMinutes % 60;
  
	if (hours >= 24) {
	  hours = 23;
	  minutes = 59;
	} else if (hours < 0) {
	  hours = 0;
	  minutes = 0;
	}
  
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  
  export const roundToNearestInterval = (minutes, interval) => {
	return Math.round(minutes / interval) * interval;
  };
  