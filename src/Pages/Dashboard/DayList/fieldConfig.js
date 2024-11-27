// src/Components/ReservationsList/fieldConfig.js

const FIELD_CONFIG = [
	{ key: 'guests', label: 'Aantal Gasten', alwaysVisible: true },
	{ key: 'time', label: 'Tijdstip', alwaysVisible: true },
	{ key: 'firstName', label: 'Naam', defaultVisible: true },
	{ key: 'email', label: 'Email', defaultVisible: true },
	{ key: 'phone', label: 'Telefoon', defaultVisible: true },
	{ key: 'extraInfo', label: 'Extra Informatie', defaultVisible: false },
	{ key: 'language', label: 'Taal', defaultVisible: false },
	{ key: 'menu', label: 'Menu', defaultVisible: false },
	{ key: 'createdAt', label: 'Aangemaakt Op', defaultVisible: false },
	// Add more fields as needed
  ];
  
  export default FIELD_CONFIG;
  