// src/components/Modal/index.js

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ModalContent from './ModalContent';
import Schema from './Schema';
import Settings from './Settings';
import './css/modalView.css';

const Modal = ({ onClose, onSave, onDelete, existingBlock, selectedDate }) => {
  const [activeTab, setActiveTab] = useState('algemeen');

  const tabs = [
    { id: 'algemeen', label: 'Algemeen' },
    { id: 'schema', label: 'Schema' },
    { id: 'instellingen', label: 'Instellingen' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <div className="settings-tabs">
          <div className="tab-menu">
            <div className="buttons-container">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  <span className="tab-label">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      className="tab-underline"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div className="tab-content" layout>
            {activeTab === 'algemeen' && (
              <ModalContent
                onClose={onClose}
                onSave={onSave}
                onDelete={onDelete}
                existingBlock={existingBlock}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'schema' && <Schema />}
            {activeTab === 'instellingen' && <Settings />}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
