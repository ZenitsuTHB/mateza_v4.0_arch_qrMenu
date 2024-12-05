// test.js

const { getGuestCountAtHour } = require('../reservation_data/counter');

// Sample reservations
const reservations = [
  { guests: "1", time: "10:01", date: "2025-01-16" },
  { guests: "1", time: "11:59", date: "2025-01-16" },
  { guests: "34", time: "13:00", date: "2025-01-16" },
  { guests: "40", time: "13:00", date: "2025-01-16" },
];

// Data including exceptions
const data = {
	"_id": "demo",
  "general-settings": {
    "zitplaatsen": 10,
    "duurReservatie": "10"
  },
	"openinghours-breakfast": {
	  "schemeSettings": {
		"Monday": {
		  "enabled": true,
		  "startTime": "07:00",
		  "endTime": "09:00",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "12",
		  "shiftsEnabled": false,
		  "shifts": []
		},
		"Wednesday": {
		  "enabled": true,
		  "startTime": "07:00",
		  "endTime": "10:00",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "12",
		  "shiftsEnabled": false,
		  "shifts": []
		}
	  },
	},
	"openinghours-lunch": {
	  "schemeSettings": {
		"Thursday": {
		  "enabled": false, // Disabled lunch on Thursday
		  "startTime": "13:00",
		  "endTime": "14:00",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "10",
		  "shiftsEnabled": false,
		  "shifts": []
		}
	  },
	},
	"openinghours-dinner": {
	  "schemeSettings": {
		"Thursday": {
		  "enabled": true,
		  "startTime": "16:00",
		  "endTime": "17:30",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "10",
		  "shiftsEnabled": false,
		  "shifts": []
		},
		"Friday": {
		  "enabled": true,
		  "startTime": "16:00",
		  "endTime": "17:00",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "10",
		  "shiftsEnabled": false,
		  "shifts": []
		},
		"Saturday": {
		  "enabled": false, // Disabled day
		  "startTime": "16:00",
		  "endTime": "18:00",
		  "maxCapacityEnabled": true,
		  "maxCapacity": "10",
		  "shiftsEnabled": false,
		  "shifts": []
		}
	  },
	},
	// Exceptions included in the data
	"exceptions": [
	  {
		"title": "Opening 4 tot 10 December",
		"type": "Uitzondering",
		"timeframe": "breakfast",
		"startDate": "2024-12-04",
		"endDate": "2024-12-10",
		"startHour": "07:00",
		"endHour": "09:00",
		"maxSeats": "333",
		"daysOfWeek": [

		],
	  },
	  {
		"title": "Opening 4 tot 10 December",
		"type": "Uitzondering",
		"timeframe": "breakfast",
		"startDate": "2024-12-04",
		"endDate": "2024-12-10",
		"startHour": "07:00",
		"endHour": "09:00",
		"maxSeats": "444",
		"daysOfWeek": [

		],
	  },
	  {
		"title": "Opening 4 tot 10 December",
		"type": "Sluiting",
		"timeframe": "breakfast",
		"startDate": "2024-12-04",
		"endDate": "2024-12-10",
		"startHour": "07:00",
		"endHour": "09:00",
		"maxSeats": "333",
		"daysOfWeek": [

		],
	  },
	  {
		"title": "Closure on December 2nd",
		"type": "Sluiting",
		"timeframe": "dinner",
		"startDate": "2024-12-02",
		"endDate": "2024-12-04",
		"daysOfWeek": [

		]
	  },
	  {
		"title": "Uitzondering on December 4th",
		"type": "Uitzondering",
		"timeframe": "breakfast",
		"startDate": "2024-12-04",
		"endDate": "2024-12-04",
		"startHour": "07:00",
		"endHour": "08:00",
		"maxSeats": "12",
		"daysOfWeek": [
		  "woensdag"
		]
	  }
	]
  };

// Test cases
console.log('--- Reservation Guest Count Tests ---');

// Test 1: Guests at 12:00
console.log('Test 1 - Guests at 12:00:', getGuestCountAtHour(data, reservations, '12:00'));
// Expected Output: 1 (Guest from 11:00 reservation)

// Test 2: Guests at 11:00
console.log('Test 2 - Guests at 11:00:', getGuestCountAtHour(data, reservations, '11:00'));
// Expected Output: 2 (Guests from 10:00 and 11:00 reservations)

// Test 3: Guests at 10:00
console.log('Test 3 - Guests at 10:00:', getGuestCountAtHour(data, reservations, '10:00'));
// Expected Output: 1 (Guest from 10:00 reservation)

// Test 4: Guests at 12:00 (Original reservations)
console.log('Test 4 - Guests at 12:00:', getGuestCountAtHour(data, reservations.slice(2), '12:00'));
// Expected Output: 35

// Test 5: Guests at 13:00
console.log('Test 5 - Guests at 13:00:', getGuestCountAtHour(data, reservations.slice(2), '13:00'));
// Expected Output: 75 (35 from 12:00 reservation and 40 from 13:00 reservation)

// Test 6: Guests at 14:00
console.log('Test 6 - Guests at 14:00:', getGuestCountAtHour(data, reservations.slice(2), '14:00'));
// Expected Output: 40

// Test 7: Guests at 14:00 (All reservations)
console.log('Test 7 - Guests at 14:00:', getGuestCountAtHour(data, reservations, '14:00'));
// Expected Output: 40

// Test 8: Guests at 11:59
console.log('Test 8 - Guests at 11:59:', getGuestCountAtHour(data, reservations, '11:59'));
// Expected Output: 1

// Test 9: Guests at 12:00 (New scenario)
console.log('Test 9 - Guests at 12:00:', getGuestCountAtHour(data, reservations, '12:00'));
// Expected Output: 1

// Test 10: Guests at 13:59
console.log('Test 10 - Guests at 13:59:', getGuestCountAtHour(data, reservations, '13:59'));
// Expected Output: 75
