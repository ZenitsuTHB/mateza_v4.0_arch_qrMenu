// src/routesConfig.js

import {
  FaChartPie,
  FaPlus,
  FaStar,
  FaPencilAlt,
  FaCalendarAlt,
  FaRocket,
  FaCog,
} from 'react-icons/fa';

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js';
import LaunchPage from '../Pages/FormEditor/LaunchPage/index.js';
import Profile from '../Pages/Profile/index.js';
import DayCalendar from '../Pages/DayCalendar/index.js';
import DayList from '../Pages/DayList/index.js';

import {
  overviewSecondaryTopBar,
  calendarSecondaryTopBar,
  designSecondaryTopBar,
} from './secondaryTabConfig.js';

const routesConfig = [
  {
    path: '/',
    element: <DayList title="Overzicht" />,
    label: 'Overzicht',
    icon: FaStar,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: overviewSecondaryTopBar,
  },

  {
    path: '/calendar',
    element: <DayCalendar title="Openingsuren" />,
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: calendarSecondaryTopBar,
  },
  {
    path: '/design',
    element: <DragAndDrop title="Ontwerp" />,
    label: 'Ontwerp',
    icon: FaPencilAlt,
    isMenu: true,
    isMobile: true,
    isTab: false,
    secondaryTopBar: designSecondaryTopBar,
  },
  {
    path: '/launch',
    element: <LaunchPage title="Lanceren" />,
    label: 'Lanceren',
    icon: FaRocket,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: designSecondaryTopBar,
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
    icon: FaCog,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: designSecondaryTopBar,
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
];

export default routesConfig;
