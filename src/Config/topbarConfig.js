// topBarConfig.js

import { FaPlus, FaPencilAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const topBarConfig = [
  {
    label: 'Add',
    icon: FaPlus,
    path: '/new-reservation',
    hasDropdown: true,
    iconColor: 'black',
    dropdownItems: [
      {
        label: 'Reserveren',
        icon: FaPlus,
        path: '/new-reservation',
        isExternal: false, // Optional, defaults to false
      },
    ],
  },
  {
    label: 'Edit',
    icon: FaPencilAlt,
    path: 'https://preview.reservaties.net/',
    isExternal: true, // Indicates external URL
    hasDropdown: true,
    iconColor: 'black',
    dropdownItems: [
      {
        label: 'Bewerken',
        icon: FaPencilAlt,
        path: 'https://preview.reservaties.net/',
        isExternal: true, // Indicates external URL
      },
    ],
  },
  {
    label: 'Account',
    icon: FaUser,
    path: '/account',
    hasDropdown: true,
    dropdownItems: [
      {
        label: 'Uitloggen',
        icon: FaSignOutAlt,
        action: 'logout',
        isLogout: true,
        iconColor: 'red',
      },
    ],
  },
];

export default topBarConfig;
