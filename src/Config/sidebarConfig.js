// src/routesConfig.js

import {
  FaChartPie,
  FaColumns,
  FaStickyNote,
  FaPencilAlt,
  FaBoxes,
  FaCalendarPlus,
  FaEdit,
  FaEye,
  FaRocket, // Additional icons for subbuttons
  FaCog, // Import the settings icon
} from 'react-icons/fa'; // Import necessary icons

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js'; // Import the FormSettings component
import Notepad from '../Pages/Notepad/index.js';
import Profile from '../Pages/Profile/index.js';
import Pincode from '../Pages/Pincode/index.js';
import NewReservation from '../Pages/NewReservation/index.js'; // Ensure correct path
import SplitScreen from '../Components/Structural/SplitScreen/index.js';

const routesConfig = [
  {
    path: '/',
    element: <DragAndDrop title="Drag and Drop" />,
    label: 'Drag and Drop',
    icon: FaPencilAlt,
    isMenu: true,
    isMobile: true,
    isTab: false,
    secondaryTopBar: [
      {
        label: 'Bewerken',
        path: '/',
        icon: FaEdit,
      },
      {
        label: 'Instellen',
        path: '/settings',
        icon: FaEye,
      },
      {
        label: 'Lanceren',
        path: '/launch',
        icon: FaRocket,
      },
    ],
  },
  // Add the new FormSettings route here
  {
    path: '/settings',
    element: <FormSettings title="Instellingen" />,
    label: 'Instellingen',
    icon: FaCog,
    isMenu: true,
    isMobile: true,
    isTab: false,
    secondaryTopBar: [
      {
        label: 'Bewerken',
        path: '/',
        icon: FaEdit,
      },
      {
        label: 'Instellen',
        path: '/settings',
        icon: FaEye,
      },
      {
        label: 'Lanceren',
        path: '/',
        icon: FaRocket,
      },
    ],
  },
  {
    path: '/profile',
    element: <Profile title="Profiel" />,
    label: 'Profiel',
    icon: FaChartPie,
    isMenu: false,
    isMobile: false,
    isTab: false,
    // No secondaryTopBar on profile page
  },
  {
    path: '/pincode',
    element: <Pincode title="Pincode" />,
    label: 'Pincode',
    icon: FaBoxes,
    isMenu: true,
    isMobile: true,
    isTab: false,
    // No secondaryTopBar on pincode page
  },
  {
    path: '/notepad',
    element: <Notepad title="Notities" />,
    label: 'Notities',
    icon: FaStickyNote,
    isMenu: true,
    isMobile: true,
    isTab: false,
    // No secondaryTopBar on notepad page
  },
  {
    path: '/new-reservation', // Dutch for 'reserve'
    element: <NewReservation title="Nieuwe Reservatie" />, // Use the new component
    label: 'Reserveren',
    icon: FaCalendarPlus, // New icon
    isMenu: true, // Show in menu
    isMobile: true, // Show on mobile
    isTab: true,
    // No secondaryTopBar on new reservation page
  },
  {
    path: '/split',
    element: <SplitScreen />,
    label: 'Split View',
    icon: FaColumns,
    isMenu: true,
    isMobile: false,
    isTab: false,
    // No secondaryTopBar on split view
  },
];

export default routesConfig;
