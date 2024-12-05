// test.js

const {
	getDataByDayAndMeal,
	getDataByDateAndMeal,
	getDataByDateAndTime,
  } = require('../restaurant_data/openinghours');
  
  const {
	getDataByDateAndMealWithExceptions,
	getDataByDateAndTimeWithExceptions,
  } = require('../restaurant_data/exceptions');
  
  // Data including exceptions
  const data = {
	"_id": "demo",
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
  
  // ------------------------
  // Tests without exceptions
  // ------------------------
  
  console.log('--- Tests without exceptions ---');
  
  // Test 1: Get data by date and meal - breakfast on December 4th
  console.log('Test 1:', getDataByDateAndMeal(data, '2024-12-04', 'breakfast')); // Should return data
  
  // Test 2: Get data by date and time exactly at startTime
  console.log('Test 2:', getDataByDateAndTime(data, '2024-12-04', '07:00')); // Should return data for breakfast
  
  // ----------------------
  // Tests with exceptions
  // ----------------------
  
  console.log('\n--- Tests with exceptions ---');
  
  // Test 1: Get data by date and meal - breakfast on December 4th (Opening applies)
  console.log('Test 1:', getDataByDateAndMealWithExceptions(data, '2024-12-04', 'breakfast')); // Should return Opening data
  
  // Test 2: Get data by date and time - breakfast on December 4th at 07:30 (within Opening time)
  console.log('Test 2:', getDataByDateAndTimeWithExceptions(data, '2024-12-04', '07:00')); // Should return Opening data
  