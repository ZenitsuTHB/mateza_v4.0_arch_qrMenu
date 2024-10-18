// src/routesConfig.js

import {
  FaChartPie,
  FaPlus,
  FaListAlt,
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
    path: '/today',
    element: <DayCalendar title="Vandaag" />,
    label: 'Vandaag',
    icon: FaListAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: [
      {
        label: 'Dag',
        path: '/day-list',
      },
      {
        label: 'Week',
        path: '/week-list',
      },
      {
        label: 'Maand',
        path: '/month-list',
      },
    ],
  },

  {
    path: '/calendar',
    element: <DayCalendar title="Openingsuren" />,
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: [
      {
        label: 'Openingsuren',
        path: '/calendar',
      },
      {
        label: 'Tafels',
        path: '/tables',
      },
    ],
  },
  {
    path: '/',
    element: <DragAndDrop title="Ontwerp" />,    label: 'Ontwerp',
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
  }
];

export default routesConfig;
