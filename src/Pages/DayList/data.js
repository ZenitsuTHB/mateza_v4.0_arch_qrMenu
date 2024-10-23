// data.js

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

const reservationsData = [];

const now = new Date();

for (let i = 1; i <= 500; i++) {
	const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	const aantalGasten = Math.floor(Math.random() * 4) + 2;
	const hour = Math.floor(Math.random() * 16) + 6;
	const minute = Math.random() < 0.5 ? '00' : '30';
	const tijdstip = `${hour.toString().padStart(2, '0')}:${minute}`;
	const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
	const phone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
	let extra = extraOptions[Math.floor(Math.random() * extraOptions.length)];

	if (extra === 'Geen extra') {
		extra = null;
	}
	let createdAt;
	if (i <= 5) {
		const minutesAgo = Math.floor(Math.random() * 60);
		createdAt = new Date(now.getTime() - minutesAgo * 60000);
	} else {
		const minutesAgo = 60 + Math.floor(Math.random() * 180);
		createdAt = new Date(now.getTime() - minutesAgo * 60000);
	}

	const daysOffset = Math.floor(Math.random() * 61) - 30;
	const reservationDate = new Date(now);
	reservationDate.setDate(now.getDate() + daysOffset);
	const year = reservationDate.getFullYear();
	const month = String(reservationDate.getMonth() + 1).padStart(2, '0');
	const day = String(reservationDate.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;

	reservationsData.push({
		id: i,
		aantalGasten,
		tijdstip,
		date: formattedDate,
		firstName,
		lastName,
		email,
		phone,
		extra,
		createdAt: createdAt.toISOString(),
	});
}

export default reservationsData;
