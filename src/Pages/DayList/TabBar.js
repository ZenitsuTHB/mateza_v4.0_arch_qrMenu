import React from 'react';
import { motion } from 'framer-motion';
import './css/settingsTabs.css'; // Ensure this path is correct based on your project structure.

const TabBar = ({ activeTab, handleTabClick }) => {
  const tabs = ['eenvoudig', 'aangepast', 'volledig'];

  return (
    <div className="form-settings-page">
      <div className="tab-menu">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            type="button"
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tab-label">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            {activeTab === tab && (
              <motion.div
                layoutId="underline-settings-tabs"
                className="tab-underline"
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
