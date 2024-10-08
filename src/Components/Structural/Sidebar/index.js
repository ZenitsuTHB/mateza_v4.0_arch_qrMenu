// Sidebar.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarItem from './SidebarItem.js';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../Redux/actions/avatarActions.js';
import routesConfig from '../../../config.js';
import './css/style.css';
import './css/mobile.css';

const avatarMapping = {
  'blue1': 'https://static.reservaties.net/images/logo/logo.png',
  'blue2': 'https://static.reservaties.net/images/logo/logo.png',
  'blue3': 'https://static.reservaties.net/images/logo/logo.png',
  'red1': 'https://static.reservaties.net/images/logo/logo.png',
  'red2': 'https://static.reservaties.net/images/logo/logo.png',
  'red3': 'https://static.reservaties.net/images/logo/logo.png',
  'green1': 'https://static.reservaties.net/images/logo/logo.png',
  'green2': 'https://static.reservaties.net/images/logo/logo.png',
  'green3': 'https://static.reservaties.net/images/logo/logo.png',
};

const defaultAvatar = 'https://static.reservaties.net/images/logo/logo.png';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [innerClass, setInnerClass] = useState('sidebar-initial');
  const profileImage = useSelector((state) => avatarMapping[state.avatar] || defaultAvatar); // Get avatar from Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobile = window.innerWidth < 900;

  useEffect(() => {
    setInnerClass('sidebar-inner');

    const selectedAvatar = localStorage.getItem('selectedAvatar');
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      dispatch(setAvatar(selectedAvatar));
    }
  }, [dispatch]);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };


  return (
        <motion.div className="sidebar" layout>
          {routesConfig
            .filter((route) => route.isMenu && (isMobile ? route.isMobile : true))
            .map((route) => (
              <SidebarItem
                key={route.path}
                item={{ id: route.path, title: route.label, icon: route.icon }}
                activeTab={activeTab}
                setActiveTab={() => handleNavigation(route.path)}
              />
            ))}
        </motion.div>
  );
};

export default Sidebar;
