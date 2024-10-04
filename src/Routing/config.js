// routesConfig.js
import { FaChartPie, FaInfoCircle, FaUsers } from 'react-icons/fa';
import Home from '../Pages/Home/index.js';
import About from '../Pages/About/index.js';
import Team from '../Pages/Team/index.js';
import Members from '../Pages/Members/index.js';

const routesConfig = [
  {
    path: '/',
    element: <Home />,
    label: 'Dashboard',
    icon: FaChartPie
  },
  {
    path: '/about',
    element: <About />,
    label: 'About',
    icon: FaInfoCircle,
    children: [
      {
        path: 'team',
        element: <Team />,
        label: 'Team',
        icon: FaUsers
      },
      {
        path: 'members',
        element: <Members />,
        label: 'Members',
        icon: FaUsers
      }
    ]
  }
];

export default routesConfig;
