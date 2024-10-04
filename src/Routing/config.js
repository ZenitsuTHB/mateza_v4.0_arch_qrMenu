// routesConfig.js
import { FaChartPie, FaInfoCircle, FaUsers } from 'react-icons/fa';
import Home from '../Pages/Home/index.js';
import About from '../Pages/About/index.js';

const routesConfig = [
  {
    path: '/',
    element: <Home />,
    label: 'Dashboard',
    icon: FaChartPie
  },
  {
    path: '/about',
    element: <About />,
    label: 'About',
    icon: FaInfoCircle,
  }
];

export default routesConfig;
