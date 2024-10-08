import React from 'react';
import { motion } from 'framer-motion';
import './css/appsMenu.css';
import icon1 from '../../../Assets/logos/1.webp'
import icon2 from '../../../Assets/logos/2.webp'
import icon3 from '../../../Assets/logos/3.webp'
import icon4 from '../../../Assets/logos/4.webp'
import icon5 from '../../../Assets/logos/5.webp'
import icon6 from '../../../Assets/logos/6.webp'
import icon7 from '../../../Assets/logos/7.webp'
import icon8 from '../../../Assets/logos/8.webp'
import icon9 from '../../../Assets/logos/9.webp'

const apps = [
  { name: 'Mateza Booking', link: '', icon: icon1 },
  { name: 'Mateza Websites', link: 'https://mateza.be/menu', icon: icon2 },
  { name: 'Mateza Gift', link: 'https://mateza.be/tables', icon: icon3 },
  { name: 'Mateza Tables', link: 'https://mateza.be/websites', icon: icon4 },
  { name: 'Mateza Predict', link: 'https://mateza.be/predict', icon: icon5 },
  { name: 'Mateza Supply', link: 'https://mateza.be/supply', icon: icon6 },
  { name: 'Mateza People', link: 'https://mateza.be/hr', icon: icon7 },
  { name: 'Mateza Pay', link: 'https://mateza.be/pay', icon: icon8 },
  { name: 'Mateza Advice', link: 'https://mateza.be/other', icon: icon9},
];

// Specify which apps are enabled
const enabledApps = ['Mateza Websites', 'Mateza Gift', 'Mateza Pay']; // Add the names of enabled apps here

const AppsMenu = ({ onClose }) => {
  return (
    <motion.div
      className="apps-menu"
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.5 }}
      onMouseLeave={onClose}
    >
      <h4 className="apps-menu-title">Onze Andere Diensten</h4>
      <div className="apps-flex-container">
        {apps.map((app, index) => {
          const isEnabled = enabledApps.includes(app.name); // Check if app is in the enabledApps array

          return (
            <a
              key={index}
              href={isEnabled ? app.link : '#'}
              className={`app-item ${isEnabled ? '' : 'disabled'}`}
              target={isEnabled ? '_blank' : ''}
              rel={isEnabled ? 'noopener noreferrer' : ''}
              onClick={(e) => !isEnabled && e.preventDefault()} // Prevent click if disabled
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
              <span className="app-name">{app.name}</span>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AppsMenu;
