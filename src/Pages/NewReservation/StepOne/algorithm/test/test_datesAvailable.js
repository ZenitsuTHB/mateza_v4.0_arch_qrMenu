// dateAvailabilityTests.js

const { isDateAvailable } = require('../isDateAvailable');
const { getDailyGuestCounts } = require('../processing/dailyGuestCounts');

// Sample data
const data = {
  "_id": "demo",
  "general-settings": {
    "zitplaatsen": "5",
    "duurReservatie": "120",       // Reservation duration of 120 minutes
    "intervalReservatie": "30"    // Time increment of 30 minutes
  },
  "openinghours-breakfast": {
    "schemeSettings": {
      "Monday": {
        "enabled": false,
        "startTime": "07:00",
        "endTime": "11:00",
        "maxCapacityEnabled": false, // Will fallback to zitplaatsen
        "maxCapacity": "0",
        "shiftsEnabled": false,
        "shifts": []
      }
    },
    "storedNumber": {
      "$numberInt": "0"
    }
  },
  "openinghours-lunch": {
    "schemeSettings": {
      "Monday": {
        "enabled": false,
        "startTime": "13:00", // Lunch starts at 13:00
        "endTime": "16:00",
        "maxCapacityEnabled": true,
        "maxCapacity": "20",
        "shiftsEnabled": false,
        "shifts": []
      }
    },
    "storedNumber": {
      "$numberInt": "0"
    }
  },
  "openinghours-dinner": {
    "schemeSettings": {
      "Monday": {
        "enabled": true,
        "startTime": "16:00",
        "endTime": "23:00",
        "maxCapacityEnabled": true,
        "maxCapacity": "5",
        "shiftsEnabled": false,
      }
    },
    "storedNumber": {
      "$numberInt": "0"
    }
  },
  "exceptions": []
};

// Sample reservations
const reservations = [
  // Dinner reservations
  { guests: "5", time: "18:00", date: "2024-12-02" }, // Shift 1 is fully booked
  { guests: "2", time: "20:00", date: "2024-12-02" }, // Shift 2 has available seats
];

console.log('--- Date Availability Tests ---');

const guests = 3;

// Test 1: Check availability on 2024-12-02
const dateStr1 = '2024-12-02';
const { guestCounts: dailyGuestCounts1, shiftsInfo } = getDailyGuestCounts(data, dateStr1, reservations);
console.log(`Daily Guest Counts for ${dateStr1}:`);
console.log(dailyGuestCounts1);
console.log('Shifts Info:', shiftsInfo);

const isAvailable1 = isDateAvailable(data, dateStr1, reservations, guests);
console.log(`Is date ${dateStr1} available for ${guests} guests? ${isAvailable1}`);
console.log('---');

// Test 2: Check availability on 2024-12-03
const dateStr2 = '2024-12-03';
const { guestCounts: dailyGuestCounts2 } = getDailyGuestCounts(data, dateStr2, reservations);
console.log(`Daily Guest Counts for ${dateStr2}:`);
console.log(dailyGuestCounts2);

const isAvailable2 = isDateAvailable(data, dateStr2, reservations, guests);
console.log(`Is date ${dateStr2} available for ${guests} guests? ${isAvailable2}`);
console.log('---');

// Test 3: Check availability on 2024-12-02 for 5 guests
const guests3 = 5;
const isAvailable3 = isDateAvailable(data, dateStr1, reservations, guests3);
console.log(`Is date ${dateStr1} available for ${guests3} guests? ${isAvailable3}`);
console.log('---');

// Test 4: Check availability on 2024-12-02 for 2 guests
const guests4 = 2;
const isAvailable4 = isDateAvailable(data, dateStr1, reservations, guests4);
console.log(`Is date ${dateStr1} available for ${guests4} guests? ${isAvailable4}`);
console.log('---');
