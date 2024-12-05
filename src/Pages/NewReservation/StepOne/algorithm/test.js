// getAvailableTimeblocksTests.js

const { getAvailableTimeblocks } = require('./getAvailableTimeblocks');

// Sample data (same as previous examples)
const data = {
  "_id": "demo",
  "general-settings": {
    "zitplaatsen": "5",
    "duurReservatie": "120",       // Reservation duration of 120 minutes
    "intervalReservatie": "30",    // Time increment of 30 minutes
    "uurOpVoorhand": "20"           // Reservations must be made at least 2 hours in advance
  },
  "openinghours-dinner": {
    "schemeSettings": {
      "Wednesday": {
        "enabled": true,
        "startTime": "16:00",
        "endTime": "23:00",
        "maxCapacityEnabled": true,
        "maxCapacity": "5",
        "shiftsEnabled": true,
        "shifts": [
          {
            "name": "Shift 1",
            "time": "18:00"
          },
          {
            "name": "Shift 2",
            "time": "20:00"
          }
        ]
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
  { guests: "5", time: "18:00", date: "2024-12-04" }, // Shift 1 is fully booked
  { guests: "2", time: "20:00", date: "2024-12-04" }, // Shift 2 has available seats
];

console.log('--- Available Time Blocks Tests ---');

const guests = 3;

// Assume today's date is '2024-12-02' and current time is '17:00' in Europe/Amsterdam
const dateStr = '2024-12-04';

const availableTimeblocks = getAvailableTimeblocks(data, dateStr, reservations, guests);

console.log(`Available time blocks for ${guests} guests on ${dateStr}:`);
console.log(JSON.stringify(availableTimeblocks, null, 2));
