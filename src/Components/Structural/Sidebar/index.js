import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem.js';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../Redux/actions/avatarActions.js';
import routesConfig from '../../../config.js';
import './css/style.css';
import './css/mobile.css';

import blue1 from '../../../Assets/avatars/blue1.webp';
import blue2 from '../../../Assets/avatars/blue2.webp';
import blue3 from '../../../Assets/avatars/blue3.webp';
import red1 from '../../../Assets/avatars/red1.webp';
import red2 from '../../../Assets/avatars/red2.webp';
import red3 from '../../../Assets/avatars/red3.webp';
import green1 from '../../../Assets/avatars/green1.webp';
import green2 from '../../../Assets/avatars/green2.webp';
import green3 from '../../../Assets/avatars/green3.webp';

const avatarMapping = {
  'blue1': blue1,
  'blue2': blue2,
  'blue3': blue3,
  'red1': red1,
  'red2': red2,
  'red3': red3,
  'green1': green1,
  'green2': green2,
  'green3': green3,
};

const defaultAvatar = blue1;

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(routesConfig[0].path);
  const [innerClass, setInnerClass] = useState('sidebar-initial');
  const profileImage = useSelector((state) => avatarMapping[state.avatar]); // Get avatar from Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    setInnerClass('sidebar-inner');
    
    const selectedAvatar = localStorage.getItem('selectedAvatar');
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      dispatch(setAvatar(selectedAvatar)); 
    }

  }, [profileImage]);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="sidebar-component">
      <motion.div className="sidebar" layout>
        <motion.div className={innerClass} layout>
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

        <motion.div
          className="sidebar-profile"
          onClick={handleProfileClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          tabIndex="0"
          role="button"
          aria-label="Profile"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleProfileClick();
            }
          }}
        >
          <span className="sidebar-item__icon">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-pic"
            />
            <span className="tooltip">Profile</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
