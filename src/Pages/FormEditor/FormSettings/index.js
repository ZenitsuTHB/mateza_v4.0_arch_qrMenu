// src/components/FormSettings/SettingsTabs.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Settings from './Settings.js';
import Colors from './Colors.js';
import Fonts from './Fonts.js'; // Import the Fonts component
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/FormSettings/settingsTabs.css';

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('formSettings');
  const [activeTitle, setActiveTitle] = useState("Tekst Instellingen");

  const tabs = [
    { id: 'formSettings', label: 'Tekst', title: "Tekst Instellingen" },
    { id: 'appearanceSettings', label: 'Kleuren', title: "Kleuren Instellingen" },
    { id: 'fontsSettings', label: 'Lettertypen', title: "Lettertype Instellingen" }, // New Fonts tab
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement save logic here if needed
  };

  return (
    <div className="form-settings-page">
      <form className="form-settings-form" onSubmit={handleSubmit}>
        <h2 className="secondary-title">{activeTitle}</h2>

        <div className="settings-tabs">
          <div className="tab-menu">
            <div className="buttons-container">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(tab.id); setActiveTitle(tab.title); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tab-label">{tab.label}</span>
                  {activeTab === tab.id && (
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

          <div className="tab-content">
            {activeTab === 'formSettings' && <Settings />}
            {activeTab === 'appearanceSettings' && <Colors />}
            {activeTab === 'fontsSettings' && <Fonts />} {/* Render Fonts component */}
          </div>
        </div>

      </form>
    </div>
  );
};

export default withHeader(SettingsTabs);
