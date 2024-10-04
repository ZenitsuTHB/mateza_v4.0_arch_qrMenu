// routesConfig.js
import { FaChartPie, FaInfoCircle, FaColumns } from 'react-icons/fa';
import Home from '../Pages/Home/index.js';
import About from '../Pages/About/index.js';
import SplitScreen from '../Components/SplitScreen/SplitScreen.js';

const routesConfig = [
  {
    path: '/',
    element: <Home title="Dashboard" />,
    label: 'Dashboard',
    icon: FaChartPie,
  },
  {
    path: '/about',
    element: <About title="About" />,
    label: 'About',
    icon: FaInfoCircle,
  },
  {
    path: '/split',
    element: (
      <SplitScreen
        left={<Home title="Dashboard" />}
        right={<About title="About" />}
      />
    ),
    label: 'Split View',
    icon: FaColumns,
  },
];

export default routesConfig;
