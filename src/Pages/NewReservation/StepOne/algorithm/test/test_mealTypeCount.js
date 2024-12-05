// mealReservationTests.js

const { getGuestCountsForMeal } = require('../processing/mealTypeCount');

// Sample data including shifts
const data = {
  "_id": "demo",
  "openinghours-breakfast": {
    "schemeSettings": {
      "Monday": {
        "enabled": true,
        "startTime": "07:00",
        "endTime": "09:30",
        "maxCapacityEnabled": true,
        "maxCapacity": "12",
        "shiftsEnabled": true,
        "shifts": [
          {
            "name": "Shift 1",
            "time": "08:00"
          },
          {
            "name": "Shift 2",
            "time": "09:00"
          }
        ]
      }
    },
    "storedNumber": {
      "$numberInt": "0"
    }
  },
  // Other meal data...
};

// Sample reservations
const reservations = [
  { guests: "5", time: "08:00", date: "2024-12-02" },
  { guests: "3", time: "09:00", date: "2024-12-02" },
  { guests: "2", time: "07:00", date: "2024-12-02" },
  { guests: "4", time: "07:30", date: "2024-12-02" },
  { guests: "6", time: "08:00", date: "2024-12-02" }, // Reservation on a different date
];

console.log('--- Meal Reservation Guest Counts Tests ---');

// Test 1: Breakfast on January 12th (Monday) with shifts
const dateStr = '2024-12-02';
const mealType = 'breakfast';

const guestCounts = getGuestCountsForMeal(data, dateStr, mealType, reservations);

console.log('Test 1 - Guest Counts for Breakfast on January 12th with Shifts:');
console.log(guestCounts);
