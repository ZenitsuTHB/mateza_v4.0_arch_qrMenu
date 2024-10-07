// AppsMenu.js
import React from 'react';
import { motion } from 'framer-motion';
import './css/appsMenu.css';

const apps = [
  { name: 'Mateza Booking', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Menu', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Tables', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Websites', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Predict', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Supply', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza HR', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Pay', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
  { name: 'Mateza Other', link: 'https://mateza.be', icon: 'https://static.reservaties.net/images/logo/logo.png' },
];

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
      <button className="apps-menu-close" onClick={onClose} aria-label="Close Apps Menu">
        &times;
      </button>
      <h4 className="apps-menu-title">Available Applications</h4>
      <div className="apps-flex-container">
        {apps.map((app, index) => (
          <a
            key={index}
            href={app.link}
            className="app-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.img
              src={app.icon}
              alt={app.name}
              className="app-icon"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <span className="app-name">{app.name}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default AppsMenu;
