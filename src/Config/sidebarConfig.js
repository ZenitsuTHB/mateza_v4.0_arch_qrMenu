// src/routesConfig.js

import {
  FaChartPie,
  FaPencilAlt,
  FaCalendarAlt,
} from 'react-icons/fa';

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js';
import LaunchPage from '../Pages/FormEditor/LaunchPage/index.js';
import Profile from '../Pages/Profile/index.js';
import DayCalendar from '../Pages/DayCalendar/index.js';

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
    path: '/calendar',
    element: <DayCalendar title="Dag Kalender" />,
    label: 'Dag Kalender',
    icon: FaCalendarAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: [
      {
        label: 'Kalender',
        path: '/calendar',
      },
      {
        label: 'Tafels',
        path: '/tables',
      },
    ],
  },
];

export default routesConfig;
