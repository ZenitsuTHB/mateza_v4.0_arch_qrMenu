// src/components/ReservationsList/data/reservationsData.js

const reservationsData = [];

for (let i = 1; i <= 30; i++) {
  reservationsData.push({
    id: i,
    aantalGasten: Math.floor(Math.random() * 4) + 2,
    tijdstip: `${Math.floor(Math.random() * 12) + 12}:${Math.random() < 0.5 ? '00' : '30'}`,
    firstName: `First${i}`,
    lastName: `Last${i}`,
    email: `user${i}@example.com`,
    phone: `06${Math.floor(10000000 + Math.random() * 90000000)}`,
    extra: Math.random() < 0.1 ? 'Special request' : null,
  });
}

export default reservationsData;
