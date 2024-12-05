// dailyGuestCountsTests.js

const { getDailyGuestCounts } = require('../processing/dailyGuestCounts');

// Sample data including overlapping meal times
const data = {
  "_id": "demo",
  "general-settings": {
    "zitplaatsen": 10,
    "duurReservatie": "1000"
  },
  "openinghours-breakfast": {
    "schemeSettings": {
      "Monday": {
        "enabled": true,
        "startTime": "07:00",
        "endTime": "11:00", // Extended breakfast to overlap with lunch
        "maxCapacityEnabled": true,
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
        "enabled": true,
        "startTime": "11:00", // Lunch starts earlier to overlap with breakfast and dinner
        "endTime": "14:00",
        "maxCapacityEnabled": true,
        "maxCapacity": "0",
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
        "startTime": "14:00", // Dinner starts earlier to overlap with lunch
        "endTime": "16:00",
        "maxCapacityEnabled": true,
        "maxCapacity": "0",
        "shiftsEnabled": false,
        "shifts": []
      }
    },
    "storedNumber": {
      "$numberInt": "0"
    }
  },
  // Any exceptions
  "exceptions": [
    // Add exceptions here if needed
  ]
};

// Sample reservations
const reservations = [
  // Breakfast reservations

  { guests: "10", time: "13:00", date: "2024-12-02" },

];

console.log('--- Daily Guest Counts Tests ---');

const dateStr = '2024-12-02';

const combinedGuestCounts = getDailyGuestCounts(data, dateStr, reservations);

console.log('Combined Guest Counts for All Meals on', dateStr, ':');
console.log(JSON.stringify(combinedGuestCounts, null, 2));
