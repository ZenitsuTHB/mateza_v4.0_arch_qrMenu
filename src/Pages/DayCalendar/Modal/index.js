// src/components/Modal/index.js

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ModalContent from './ModalContent';
import Schema from './Schema';
import Instellingen from './Instellingen';
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
    <div className="modal-overlay">
      <div className="modal-content">
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
            {activeTab === 'instellingen' && <Instellingen />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
