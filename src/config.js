// src/routesConfig.js

import { FaChartPie, FaColumns, FaStickyNote, FaPencilAlt, FaBoxes, FaCalendarPlus } from 'react-icons/fa'; // Import FaCalendarPlus
import DragAndDrop from './Pages/FormEditor/index.js';
import Notepad from './Pages/Notepad/index.js';
import Profile from './Pages/Profile/index.js';
import Pincode from './Pages/Pincode/index.js';
import NewReservation from './Pages/NewReservation/index.js'; // Import the new component
import SplitScreen from './Components/Structural/SplitScreen/index.js';

const routesConfig = [
  {
    path: '/',
    element: <DragAndDrop title="Drag and Drop" />,
    label: 'Drag and Drop',
    icon: FaPencilAlt,
    isMenu: true,
    isMobile: true,
    isTab: false,
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
    path: '/pincode',
    element: <Pincode title="Pincode" />,
    label: 'Pincode',
    icon: FaBoxes,
    isMenu: true,
    isMobile: true,
    isTab: false,
  },
  {
    path: '/notepad',
    element: <Notepad title="Notities" />,
    label: 'Notities',
    icon: FaStickyNote,
    isMenu: true,
    isMobile: true,
    isTab: false,
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
  {
    path: '/new-reservation', // Dutch for 'reserve'
    element: <NewReservation />, // Use the new component
    label: 'Reserveren',
    icon: FaCalendarPlus, // New icon
    isMenu: true, // Show in menu
    isMobile: true, // Show on mobile
    isTab: true,
  },
];

export default routesConfig;
