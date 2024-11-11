// src/components/ReservationForm/Utils/generateAvailableDates.js

export const generateAvailableDates = (timeblocks) => {
	const availableDates = timeblocks.map((block) => block.date);
	const uniqueDates = Array.from(new Set(availableDates)).sort();
	return uniqueDates;
  };
  