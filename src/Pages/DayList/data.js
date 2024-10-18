// src/components/ReservationsList/data/reservationsData.js

const firstNames = ['Jan', 'Maria', 'Peter', 'Linda', 'Mark', 'Sophie', 'Thomas', 'Laura', 'Robert', 'Emma'];
const lastNames = ['Jansen', 'De Vries', 'Bakker', 'Visser', 'Smit', 'Meijer', 'Mulder', 'De Boer', 'Bos', 'Vos'];

const reservationsData = [];

for (let i = 1; i <= 30; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const aantalGasten = Math.floor(Math.random() * 4) + 2;
  const hour = Math.floor(Math.random() * 12) + 12;
  const minute = Math.random() < 0.5 ? '00' : '30';
  const tijdstip = `${hour}:${minute}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
  const extra = Math.random() < 0.1 ? 'Special request' : null;

  reservationsData.push({
    id: i,
    aantalGasten,
    tijdstip,
    firstName,
    lastName,
    email,
    phone,
    extra,
  });
}

export default reservationsData;
