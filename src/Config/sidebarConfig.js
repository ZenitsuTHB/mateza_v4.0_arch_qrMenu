// src/routesConfig.js

import {
  FaChartPie,
  FaPlus,
  FaStar,
  FaPencilAlt,
  FaCalendarAlt,
  FaRocket,
  FaCog,
  FaGift,
  FaFlag,
  FaShieldAlt,
  FaUser,
  FaTable,
} from 'react-icons/fa';

import DragAndDrop from '../Pages/FormEditor/index.js';
import FormSettings from '../Pages/FormEditor/FormSettings/index.js';
import SettingsTabs from '../Pages/FormEditor/FormSettings/SettingsTabs.js';
import LaunchPage from '../Pages/FormEditor/LaunchPage/index.js';
import Profile from '../Pages/Profile/index.js';
import DayCalendar from '../Pages/DayCalendar/index.js';
import DayList from '../Pages/DayList/index.js';
import GiftCard from '../Pages/GiftCard/index.js'

import {
  overviewSecondaryTopBar,
  calendarSecondaryTopBar,
  designSecondaryTopBar,
  giftCardSecondaryTopBar,
  accountSecondaryTopBar,
} from './secondaryTabConfig.js';
import GiftcardEditor from '../Pages/GiftcardEditor/index.js';
import Language from '../Pages/Profile/Language/index.js';
import NewReservation from '../Pages/NewReservation/index.js';
import SchemeStandalone from '../Pages/DayCalendar/SchemeStandalone.js';
import CalendarComponent from '../Pages/CalendarMap/index.js';
import TablePlan from '../Pages/TablePlan/index.js';

const routesConfig = [
  
  {
    path: '/',
    element: <CalendarComponent title="Maandoverzicht" />,
    label: 'Maandoverzicht',
    icon: FaStar,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: overviewSecondaryTopBar,
  },
  {
    path: '/day',
    element: <DayList title="Dagoverzicht" />,
    label: 'Dagoverzicht',
    icon: FaStar,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: overviewSecondaryTopBar,
  },
  {
    path: '/scheme',
    element: <SchemeStandalone title="Openingsuren" />,
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
    sidebarHidden: false,
    secondaryTopBar: calendarSecondaryTopBar,
  },
  {
    path: '/scheme/calendar',
    element: <DayCalendar title="Openingskalender" />,
    label: 'Openingskalender',
    icon: FaTable,
    isMenu: false,
    isMobile: false,
    isTab: false,
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
    path: '/design/launch',
    element: <LaunchPage title="Lanceren" />,
    label: 'Lanceren',
    icon: FaRocket,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: designSecondaryTopBar,
    sidebarHidden: false,
  },
  {
    path: 'design/settings',
    element: <FormSettings title="Instellingen" />,
    label: 'Instellingen',
    icon: FaCog,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: designSecondaryTopBar,
  },
  {
    path: '/new-reservation',
    element: <NewReservation title="Reserveren" />,
    label: 'Reserveren',
    icon: FaPlus,
    isMenu: true,
    isMobile: true,
    isTab: true,
    sidebarHidden: false,
  },
  {
    path: '/settings-preview',
    element: <SettingsTabs title="" />,
    label: 'Instellingen',
    icon: FaCog,
    isMenu: false,
    isMobile: false,
    isTab: false,
    sidebarHidden: true,
  },
  {
    path: '/account',
    element: <Profile title="Account" />,
    label: 'Account',
    icon: FaUser,
    isMenu: false,
    isMobile: false,
    isTab: false,
  },
  {
    path: '/account/language',
    element: <Language title="Taal" />,
    label: 'Taal',
    icon: FaFlag,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: accountSecondaryTopBar,
  },
  {
    path: '/account/security',
    element: <Profile title="Beveiliging" />,
    label: 'Beveiliging',
    icon: FaShieldAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: accountSecondaryTopBar,
  },
  {
    path: '/table-plan',
    element: <TablePlan title="Tafelplan" />,
    label: 'Tafelplan',
    icon: FaTable,
    isMenu: true,
    isMobile: true,
    isTab: true,
  },

  {
    path: '/giftcard',
    element: <GiftCard title="Cadeaubonnen" />,
    label: 'Cadeaubonnen',
    icon: FaGift,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: giftCardSecondaryTopBar,
  },
  {
    path: '/giftcard/editor',
    element: <GiftcardEditor title="Cadeaubonnen Ontwerpen" />,
    label: 'Cadeaubonnen Ontwerpen',
    icon: FaPencilAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: giftCardSecondaryTopBar,
  }
];



export default routesConfig;
