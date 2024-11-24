import { FaPlus, FaChartLine, FaLock, FaUser, FaCog, FaPencilAlt } from 'react-icons/fa';

const topBarConfig = [
  {
    label: 'Add',
    icon: FaPlus,
    path: '/new-reservation',
  },

  {
    label: 'Edit',
    icon: FaPencilAlt,
    path: '/edit',
  },
  {
    label: 'Account',
    icon: FaUser,
    path: '/account',
    hasDropdown: true,
  },
];

export default topBarConfig;
