// routesConfig.js
import { FaChartPie, FaColumns, FaStickyNote, FaPencilAlt, FaBoxes } from 'react-icons/fa'; // Import the new icon
import DragAndDrop from './Pages/FormEditor/index.js';
import Notepad from './Pages/Notepad/index.js';
import Profile from './Pages/Profile/index.js';
import Pincode from './Pages/Pincode/index.js';

import SplitScreen from './Components/Structural/SplitScreen/index.js';

const routesConfig = [
  {
    path: '/',
    element: <DragAndDrop title="Drag and Drop" />,
    label: 'Drag and Drop',
    icon: FaPencilAlt,
    isMenu: true,
    isMobile: true,
    isTab: true,
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
    label: '',
    icon: FaBoxes,
    isMenu: true,
    isMobile: true,
    isTab: false,
  },
  {
    path: '/notepad',
    element: <Notepad title="Notities" />,
    label: 'Notities',
    icon: FaStickyNote, // Use FaStickyNote for the notepad route
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
