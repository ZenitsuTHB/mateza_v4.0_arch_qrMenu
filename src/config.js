// routesConfig.js
import { FaChartPie, FaColumns, FaStickyNote } from 'react-icons/fa'; // Import the new icon
import About from './Pages/About/index.js';
import Notepad from './Pages/Notepad/index.js';
import Profile from './Pages/Profile/index.js';

import SplitScreen from './Components/Structural/SplitScreen/index.js';

const routesConfig = [
  {
    path: '/',
    element: <About title="Dashboard" />,
    label: 'Dashboard',
    icon: FaChartPie,
    isMenu: true,
    isMobile: true,
    isTab: true,
  },
  {
    path: '/profile',
    element: <Profile title="Profiel" />,
    label: 'Profiel',
    icon: FaChartPie,
    isMenu: false,
    isMobile: false,
    isTab: false,
  },
  {
    path: '/notepad',
    element: <Notepad title="Notities" />,
    label: 'Notities',
    icon: FaStickyNote, // Use FaStickyNote for the notepad route
    isMenu: true,
    isMobile: true,
    isTab: true,
  },
  {
    path: '/split',
    element: <SplitScreen />,
    label: 'Split View',
    icon: FaColumns,
    isMenu: true,
    isMobile: false,
    isTab: false,
  },
];

export default routesConfig;
