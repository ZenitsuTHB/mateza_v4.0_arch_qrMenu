// timeblocksAvailableTests.js

const { timeblocksAvailable } = require('../processing/timeblocksAvailable');

// Sample data (same as previous examples)
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
        "maxCapacityEnabled": false,
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
        "startTime": "13:00",
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
  { guests: "5", time: "18:00", date: "2024-12-02" }, // Shift 1 is fully booked
  { guests: "2", time: "20:00", date: "2024-12-02" }, // Shift 2 has available seats
];

console.log('--- Time Blocks Availability Tests ---');

const guests = 3;
const dateStr = '2024-12-02';

const availableTimeblocks = timeblocksAvailable(data, dateStr, reservations, guests);

console.log(`Available time blocks for ${guests} guests on ${dateStr}:`);
console.log(availableTimeblocks);
