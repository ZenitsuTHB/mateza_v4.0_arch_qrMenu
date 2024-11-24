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
      },
    ],
  },
  {
    label: 'Edit',
    icon: FaPencilAlt,
    path: '/edit',
    hasDropdown: true,
    iconColor: 'black',
    dropdownItems: [
      {
        label: 'Bewerken',
        icon: FaPencilAlt,
        path: '/edit-reservation',
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
