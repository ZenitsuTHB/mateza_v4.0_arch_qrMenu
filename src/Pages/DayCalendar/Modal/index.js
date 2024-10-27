// src/components/Modal/index.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModalContent from './ModalContent';
import Schema from './Schema';
import Settings from './Settings';
import { formatDateKey } from '../Utils/dateFormat'; // Ensure this import is present
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

  // Initialize Schema state
  const [schemaSettings, setSchemaSettings] = useState(
    existingBlock?.schemaSettings || {}
  );

  // Function to format the date in Dutch
  const formatDateDutch = (date) => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  // Form-related state lifted up to Modal
  const [formData, setFormData] = useState({
    title: existingBlock
      ? existingBlock.title
      : `Tijdsblok (${formatDateDutch(selectedDate)})`,
    startTime: existingBlock ? existingBlock.startTime : '17:00',
    endTime: existingBlock ? existingBlock.endTime : '23:00',
    kleurInstelling: existingBlock ? existingBlock.kleurInstelling : '#2c909b',
    zitplaatsen: existingBlock ? existingBlock.zitplaatsen : 1,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSave = (continueToSettings = false) => {
    if (formData.zitplaatsen < 1) {
      alert('Zitplaatsen moet een positief getal zijn.');
      return;
    }

    const newBlock = {
      id: existingBlock ? existingBlock._id : undefined,
      _id: existingBlock ? existingBlock._id : undefined,
      date: formatDateKey(selectedDate),
      ...formData,
      schemaSettings,
    };
    onSave(newBlock, continueToSettings);
  };

  const handleDelete = () => {
    onDelete(existingBlock);
  };

  const handleSaveSchema = () => {
    handleSave();
  };

  const handleDeleteSchema = () => {
    setSchemaSettings({});
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
        onClick={(e) => e.stopPropagation()}
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
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                onDelete={handleDelete}
                existingBlock={existingBlock}
                selectedDate={selectedDate}
              />
            )}
            {activeTab === 'schema' && (
              <Schema
                schemaSettings={schemaSettings}
                setSchemaSettings={setSchemaSettings}
                onSaveSchema={handleSaveSchema}
                onDeleteSchema={handleDeleteSchema}
              />
            )}
            {activeTab === 'instellingen' && <Settings />}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
