// src/routesConfig.js

import {
  FaPlus,
  FaStar,
  FaCalendarAlt,
  FaCog,
  FaFlag,
  FaShieldAlt,
  FaUser,
  FaTable,
  FaMailBulk,
  FaGift,
  FaPencilAlt,
  FaChair,
} from 'react-icons/fa';

import Profile from '../Pages/Profile/index.js';
import DayCalendar from '../Pages/DayCalendar/index.js';
import DayList from '../Pages/Dashboard/DayList/index.js';
import GiftCard from '../Pages/Giftcard/GiftCard'
import GiftcardEditor from '../Pages/Giftcard/GiftcardEditor'
import TablePlan from '../Pages/Tables/TablePlan/index.js'


import {
  overviewSecondaryTopBar,
  calendarSecondaryTopBar,
  accountSecondaryTopBar,
  settingsSecondaryTopBar,
  giftCardSecondaryTopBar,
  tableSecondaryTopBar
} from './secondaryTabConfig.js';
import Language from '../Pages/Profile/Language/index.js';
import NewReservationAdmin from '../Pages/NewReservation/index.js';
import SchemeStandalone from '../Pages/DayCalendar/SchemeStandalone.js';
import RootComponent from './RootComponent.js';
import Settings from '../Pages/Settings/GeneralSettings/index.js';
import EmailSettings from '../Pages/Settings/EmailSettings/index.js';
import TableEditor from '../Pages/Tables/TableEditor/index.js';


const routesConfig = [
  {
    path: '/',
    element: <RootComponent />, // Use RootComponent here
    label: 'Dashboard',
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
    path: '/settings',
    element: <Settings title="Administratie" />,
    label: 'Administratie',
    icon: FaCog,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: settingsSecondaryTopBar,
  },

  {
    path: '/settings/email',
    element: <EmailSettings title="Administratie" />,
    label: 'Email Notificaties',
    icon: FaMailBulk,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: settingsSecondaryTopBar,
  },
  {
    path: '/new-reservation',
    element: <NewReservationAdmin title="Reserveren" />,
    label: 'Reserveren',
    icon: FaPlus,
    isMenu: true,
    isMobile: true,
    isTab: true,
    sidebarHidden: false,
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
    path: '/table',
    element: <TablePlan title="Tafelplan" />,
    label: 'Tafelplan',
    icon: FaChair,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: tableSecondaryTopBar,
  },
  {
    path: 'table/table-editor',
    element: <TableEditor title="Tafels Bewerken" />,
    label: 'Tafels Bewerken',
    icon: FaTable,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: tableSecondaryTopBar,
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
