// routesConfig.js
import { FaChartPie, FaInfoCircle, FaColumns } from 'react-icons/fa';
import Home from '../Pages/Home/index.js';
import SplitScreen from '../Components/SplitScreen/SplitScreen.js';

const routesConfig = [
  {
    path: '/',
    element: <Home title="Dashboard" />,
    label: 'Dashboard',
    icon: FaChartPie,
  },
  {
    path: '/split',
    element: (
      <SplitScreen
        left={<Home title="Dashboard" />}
        // The right pane is now managed by PaneNavigator within SplitScreen
      />
    ),
    label: 'Split View',
    icon: FaColumns,
  },
];

export default routesConfig;
