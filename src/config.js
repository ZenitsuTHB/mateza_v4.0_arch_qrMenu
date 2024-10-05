import { FaChartPie, FaColumns } from 'react-icons/fa';
import Home from './Pages/Home/index.js';
import SplitScreen from './Components/Structural/SplitScreen/SplitScreen.js';

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
      />
    ),
    label: 'Split View',
    icon: FaColumns,
  },
];

export default routesConfig;
