// src/components/NewReservation/formConfig.js

import image1 from '../../Assets/themes/original/20.jpg'; // Adjust the path as necessary

export const title = 'Reserveer een Tafel';
export const notification = 'Uw reservering is succesvol geplaatst!';
export const theme = {
  id: 1,
  title: 'Oceaan Bries',
  color: 'pink',
  image: image1, // Imported image
};


export const font = "Poppins";

export const fields = [
  {
    id: 'naam',
    type: 'input',
    label: 'Naam',
    placeholder: 'Uw naam',
    required: true,
  },
  {
    id: 'email',
    type: 'email',
    label: 'E-mail',
    placeholder: 'Uw e-mailadres',
    required: true,
  },
  {
    id: 'telefoonnummer',
    type: 'tel', // Changed to 'tel' for better semantics
    label: 'Telefoonnummer',
    placeholder: 'Uw telefoonnummer',
    required: true,
  },
  {
    id: 'datum',
    type: 'date',
    label: 'Datum',
    required: true,
  },
  {
    id: 'tijd',
    type: 'time',
    label: 'Tijd',
    required: true,
  },
  {
    id: 'aantalPersonen',
    type: 'number',
    label: 'Aantal Personen',
    placeholder: 'Bijvoorbeeld: 4',
    required: true,
    min: '1',
  },
  {
    id: 'opmerkingen',
    type: 'textarea',
    label: 'Opmerkingen',
    placeholder: 'Eventuele opmerkingen of speciale verzoeken',
    required: false,
  },
];
