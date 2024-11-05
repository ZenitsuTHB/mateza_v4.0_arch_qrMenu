// reservationData.js

export const maxCapacity = 100; // Define the maximum capacity

const firstNames = [
  'Jan', 'Maria', 'Peter', 'Linda', 'Mark',
  'Sophie', 'Thomas', 'Laura', 'Robert', 'Emma',
  'Lucas', 'Olivia', 'Liam', 'Ava', 'Noah',
  'Isabella', 'Ethan', 'Mia', 'Mason', 'Charlotte'
];
const lastNames = [
  'Jansen', 'De Vries', 'Bakker', 'Visser', 'Smit',
  'Meijer', 'Mulder', 'De Boer', 'Bos', 'Vos',
  'Peters', 'Hendriksen', 'Kuiper', 'Dekker', 'Verhoeven',
  'Martens', 'Laurens', 'Van Dijk', 'Van den Berg', 'De Groot'
];

const extraOptions = [
  'Vegetarisch menu', 'Extra broodjes', 'Babystoel nodig',
  'Geen extra', 'Geen extra', 'Geen extra',
  'Geen extra', 'Geen extra', 'Geen extra', null
];

const reservations = [];

const now = new Date();

// Helper function to get a weighted day offset
function getWeightedDayOffset() {
  const pastDays = 30;
  const futureDays = 30;
  
  const pastWeight = pastDays; // Each past day has weight 1
  const futureWeightTotal = 15.5; // Sum of weights for future days
  const totalWeight = pastWeight + futureWeightTotal; // 45.5

  const rand = Math.random() * totalWeight;

  if (rand < pastWeight) {
    // Past date: Uniform distribution
    return -pastDays + Math.floor(Math.random() * pastDays);
  } else {
    // Future date: Weighted distribution
    const futureRand = rand - pastWeight;
    let cumulative = 0;
    for (let d = 1; d <= futureDays; d++) {
      const weight = (31 - d) / 30; // Linearly decreasing weight
      cumulative += weight;
      if (futureRand < cumulative) {
        return d;
      }
    }
    return futureDays; // Fallback to the last day
  }
}

for (let i = 1; i <= 500; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
  const aantalGasten = Math.floor(Math.random() * 4) + 2;

  // Get weighted day offset
  const daysOffset = getWeightedDayOffset();

  const reservationDate = new Date(now);
  reservationDate.setDate(now.getDate() + daysOffset);

  const year = reservationDate.getFullYear();
  const month = String(reservationDate.getMonth() + 1).padStart(2, '0');
  const day = String(reservationDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // Random time slot
  const timeSlot = Math.floor(Math.random() * 3);
  let hour;
  switch (timeSlot) {
    case 0: // Morning
      hour = Math.floor(Math.random() * 6) + 6; // 6 - 11
      break;
    case 1: // Afternoon
      hour = Math.floor(Math.random() * 6) + 12; // 12 - 17
      break;
    case 2: // Evening
      hour = Math.floor(Math.random() * 6) + 18; // 18 - 23
      break;
  }
  const minute = Math.random() < 0.5 ? '00' : '30';
  const tijdstip = `${hour.toString().padStart(2, '0')}:${minute}`;

  let extra = extraOptions[Math.floor(Math.random() * extraOptions.length)];

  if (extra === 'Geen extra') {
    extra = null;
  }

  reservations.push({
    id: i,
    date: formattedDate,
    time: tijdstip,
    fullName,
    email,
    phone,
    aantalGasten,
    extra,
    timeSlot: timeSlot, // 0: Morning, 1: Afternoon, 2: Evening
  });
}

export default reservations;
