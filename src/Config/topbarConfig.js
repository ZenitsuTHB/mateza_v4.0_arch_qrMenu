import { FaPlus, FaChartLine, FaLock, FaUser } from 'react-icons/fa';

const topBarConfig = [
  {
    label: 'Add',
    icon: FaPlus,
    path: '/new-reservation',
  },
  {
    label: 'Analytics',
    icon: FaChartLine,
    path: '/analytics',
  },
  {
    label: 'Lock',
    icon: FaLock,
    path: '/lock',
  },
  {
    label: 'Account',
    icon: FaUser,
    path: '/account',
  },
];

export default topBarConfig;
