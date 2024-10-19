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
	'Kerstdecoraties', 'Glasheldere drankjes', 'Geen extra',
	'Grote tafel voorkeur', 'Kindermenu', 'Lactosevrij', null
  ];
  
  const reservationsData = [];
  
  const now = new Date();
  
  for (let i = 1; i <= 50; i++) {
	const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	const aantalGasten = Math.floor(Math.random() * 5) + 2;
	const hour = Math.floor(Math.random() * 12) + 12;
	const minute = Math.random() < 0.5 ? '00' : '30';
	const tijdstip = `${hour.toString().padStart(2, '0')}:${minute}`;
	const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
	const phone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
	const extra = extraOptions[Math.floor(Math.random() * extraOptions.length)];
  
	// Generate 'createdAt' timestamps
	let createdAt;
	if (i <= 5) {
	  // For the first 5 reservations, set 'createdAt' within the last hour
	  const minutesAgo = Math.floor(Math.random() * 60); // 0 to 59 minutes ago
	  createdAt = new Date(now.getTime() - minutesAgo * 60000);
	} else {
	  // For others, set 'createdAt' more than an hour ago
	  const minutesAgo = 60 + Math.floor(Math.random() * 180); // 61 to 240 minutes ago
	  createdAt = new Date(now.getTime() - minutesAgo * 60000);
	}
  
	reservationsData.push({
	  id: i,
	  aantalGasten,
	  tijdstip,
	  firstName,
	  lastName,
	  email,
	  phone,
	  extra,
	  createdAt: createdAt.toISOString(), // Store as ISO string for consistency
	});
  }
  
  export default reservationsData;
  