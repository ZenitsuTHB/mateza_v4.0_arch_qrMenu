// AppsMenu.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './css/appsMenu.css';
import AppsSearchBar from './AppsSearchBar'; // Import the new search bar
import icon1 from '../../../Assets/logos/1.webp';
import icon2 from '../../../Assets/logos/2.webp';
import icon3 from '../../../Assets/logos/3.webp';
import icon4 from '../../../Assets/logos/4.webp';
import icon5 from '../../../Assets/logos/5.webp';
import icon6 from '../../../Assets/logos/6.webp';
import icon7 from '../../../Assets/logos/7.webp';
import icon8 from '../../../Assets/logos/8.webp';
import icon9 from '../../../Assets/logos/9.webp';

const apps = [
  { name: 'Mateza Booking', link: '', icon: icon1 },
  { name: 'Mateza Websites', link: 'https://mateza.be/menu', icon: icon2 },
  { name: 'Mateza Gift', link: 'https://mateza.be/tables', icon: icon3 },
  { name: 'Mateza Tables', link: 'https://mateza.be/websites', icon: icon4 },
  { name: 'Mateza Predict', link: 'https://mateza.be/predict', icon: icon5 },
  { name: 'Mateza Supply', link: 'https://mateza.be/supply', icon: icon6 },
  { name: 'Mateza People', link: 'https://mateza.be/hr', icon: icon7 },
  { name: 'Mateza Pay', link: 'https://mateza.be/pay', icon: icon8 },
  { name: 'Mateza Advice', link: 'https://mateza.be/other', icon: icon9 },
];

const enabledApps = ['Mateza Booking', 'Mateza Websites', 'Mateza Gift'];

const AppsMenu = ({ onMouseEnter, onMouseLeave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);

  // Filter apps based on search term
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to highlight matched text
  const highlightMatch = (name) => {
    if (!searchTerm) return name;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = name.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onMouseLeave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onMouseLeave]);

  return (
    <motion.div
      ref={menuRef}
      className="apps-menu"
      initial={{ opacity: 0, y: '-20px' }}
      animate={{ opacity: 1, y: '0' }}
      exit={{ opacity: 0, y: '-20px' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >		
      <AppsSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="apps-flex-container">
        {filteredApps.map((app, index) => {
          const isEnabled = enabledApps.includes(app.name);

          return (
            <a
              key={index}
              href={isEnabled ? app.link : '#'}
              className={`app-item ${isEnabled ? '' : 'disabled'}`}
              target={isEnabled ? '_blank' : ''}
              rel={isEnabled ? 'noopener noreferrer' : ''}
              onClick={(e) => !isEnabled && e.preventDefault()}
              aria-label={isEnabled ? `Open ${app.name}` : `${app.name} is disabled`}
            >
              <motion.img
                src={app.icon}
                alt={app.name}
                className="app-icon"
                style={{
                  filter: isEnabled ? 'none' : 'blur(2px)',
                  opacity: isEnabled ? 1 : 0.5,
                }}
              />
              <span className="app-name">{highlightMatch(app.name)}</span>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AppsMenu;
