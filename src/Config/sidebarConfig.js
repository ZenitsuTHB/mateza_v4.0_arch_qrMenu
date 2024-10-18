// src/routesConfig.js

import {
  FaChartPie,
  FaColumns,
  FaStickyNote,
  FaPencilAlt,
  FaBoxes,
  FaCalendarPlus,
} from 'react-icons/fa';

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js';
import LaunchPage from '../Pages/FormEditor/LaunchPage/index.js';
import Notepad from '../Pages/Notepad/index.js';
import Profile from '../Pages/Profile/index.js';
import Pincode from '../Pages/Pincode/index.js';
import NewReservation from '../Pages/NewReservation/index.js';
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
      },
      {
        label: 'Instellen',
        path: '/settings',
      },
      {
        label: 'Lanceren',
        path: '/launch',
      },
    ],
  },
  {
    path: '/launch',
    element: <LaunchPage title="Lanceren" />,
    label: 'Lanceren',
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: [
      {
        label: 'Bewerken',
        path: '/',
      },
      {
        label: 'Instellen',
        path: '/settings',
      },
      {
        label: 'Lanceren',
        path: '/launch',
      },
    ],
  },
  {
    path: '/settings',
    element: <FormSettings title="Instellingen" />,
    label: 'Instellingen',
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: [
      {
        label: 'Bewerken',
        path: '/',
      },
      {
        label: 'Instellen',
        path: '/settings',
      },
      {
        label: 'Lanceren',
        path: '/launch',
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
    path: '/new-reservation',
    element: <NewReservation title="Nieuwe Reservatie" />,
    label: 'Reserveren',
    icon: FaCalendarPlus,
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
