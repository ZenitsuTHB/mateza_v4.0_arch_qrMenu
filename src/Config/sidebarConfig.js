// src/routesConfig.js

import {
  FaChartPie,
  FaPlus,
  FaStar,
  FaPencilAlt,
  FaCalendarAlt,
} from 'react-icons/fa';

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js';
import LaunchPage from '../Pages/FormEditor/LaunchPage/index.js';
import Profile from '../Pages/Profile/index.js';
import DayCalendar from '../Pages/DayCalendar/index.js';
import DayList from '../Pages/DayList/index.js';


const routesConfig = [
  {
    path: '/day-list',
    element: <DayList title="Overzicht" />,
    label: 'Overzicht',
    icon: FaStar,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: [
      {
        label: 'Dag',
        path: '/day-list',
      },
      {
        label: 'Maand',
        path: '/month-list',
      },
      {
        label: 'Tafels',
        path: '/table',
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
    element: <DragAndDrop title="Bewerken" />,    label: 'Bewerken',
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
    path: '/new-reservation',
    element: <Profile title="Nieuwe Reservatie" />,
    label: 'Nieuwe Reservatie',
    icon: FaPlus,
    isMenu: true,
    isMobile: true,
    isTab: true,
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
