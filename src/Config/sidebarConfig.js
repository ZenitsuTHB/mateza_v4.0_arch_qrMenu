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
    element: <Profile title="Reserveren" />,
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
    secondaryTopBar: accountSecondaryTopBar,
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
    label: 'Cadeaubonnen Ontwerpenr',
    icon: FaPencilAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: giftCardSecondaryTopBar,
  },
];

export default routesConfig;
