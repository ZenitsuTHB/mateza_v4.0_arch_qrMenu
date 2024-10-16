// src/components/FormSettings/SettingsTabs.jsx

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Settings from './Settings.js';
import Colors from './Colors.js';
import Fonts from './Fonts.js'; 
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/FormSettings/settingsTabs.css';

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('formSettings');
  const [activeTitle, setActiveTitle] = useState("Tekst Instellingen");
  const [pendingTab, setPendingTab] = useState(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  // Create refs for each tab component
  const settingsRef = useRef();
  const colorsRef = useRef();
  const fontsRef = useRef();

  const tabs = [
    { id: 'formSettings', label: 'Tekst', title: "Tekst Instellingen" },
    { id: 'appearanceSettings', label: 'Kleuren', title: "Kleuren Instellingen" },
    { id: 'fontsSettings', label: 'Lettertypen', title: "Lettertype Instellingen" },
  ];

  // Prevent form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTabClick = (tabId, tabTitle) => {
    // Check if current tab has unsaved changes
    let currentRef;
    if (activeTab === 'formSettings') {
      currentRef = settingsRef;
    } else if (activeTab === 'appearanceSettings') {
      currentRef = colorsRef;
    } else if (activeTab === 'fontsSettings') {
      currentRef = fontsRef;
    }

    if (currentRef && currentRef.current && currentRef.current.isDirty) {
      // There are unsaved changes, show modal
      setPendingTab({ id: tabId, title: tabTitle });
      setShowUnsavedChangesModal(true);
    } else {
      // No unsaved changes, proceed to change tab
      setActiveTab(tabId);
      setActiveTitle(tabTitle);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedChangesModal(false);
    if (pendingTab) {
      setActiveTab(pendingTab.id);
      setActiveTitle(pendingTab.title);
      setPendingTab(null);
    }
  };

  const handleCancelTabChange = () => {
    setShowUnsavedChangesModal(false);
    setPendingTab(null);
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
                  type="button" // Prevent form submission
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id, tab.title)}
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
            {activeTab === 'formSettings' && <Settings ref={settingsRef} />}
            {activeTab === 'appearanceSettings' && <Colors ref={colorsRef} />}
            {activeTab === 'fontsSettings' && <Fonts ref={fontsRef} />}
          </div>
        </div>
      </form>

      {showUnsavedChangesModal && (
        <div className="unsaved-changes-modal">
          <div className="modal modal-content">
            <h2 className='secondary-title secondary-title-small'>Wijzigingen Niet Opgeslagen</h2>
            <p>Wilt doorgaan zonder op te slaan?</p>
            <div className="modal-buttons">
              <button type="button" className="button cancel-button" onClick={handleCancelTabChange}>Annuleren</button>
              <button type="button" className="button discard-button" onClick={handleDiscardChanges}>Doorgaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withHeader(SettingsTabs);
