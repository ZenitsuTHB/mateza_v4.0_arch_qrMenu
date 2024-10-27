// src/components/Modal/index.js

import React, { useState, useEffect } from 'react';
import ModalWithTabs from './ModalWithTabs';
import ModalContent from './ModalContent';
import Schema from './Schema';
import ExceptionalDays from './Exceptions'; // Import the new component
import Settings from './Settings';
import { formatDateKey } from '../Utils/dateFormat';
import './css/modalView.css';

const Modal = ({ onClose, onSave, onDelete, existingBlock, selectedDate }) => {
  const [schemaSettings, setSchemaSettings] = useState(
    existingBlock?.schemaSettings || {}
  );

  const [exceptionalDays, setExceptionalDays] = useState(
    existingBlock?.exceptionalDays || [
      {
        enabled: false,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        type: 'closing',
      },
    ]
  );

  const formatDateDutch = (date) => {
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

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
      exceptionalDays,
    };
    onSave(newBlock, continueToSettings);
  };

  const handleDelete = () => {
    onDelete(existingBlock);
  };

  const handleSaveSchema = () => {
    handleSave();
  };

  const handleSaveExceptionalDays = () => {
    handleSave();
  };

  const tabs = [
    {
      id: 'algemeen',
      label: 'Algemeen',
      content: (
        <ModalContent
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onDelete={handleDelete}
          existingBlock={existingBlock}
          selectedDate={selectedDate}
        />
      ),
    },
    {
      id: 'schema',
      label: 'Schema',
      content: (
        <Schema
          schemaSettings={schemaSettings}
          setSchemaSettings={setSchemaSettings}
          onSaveSchema={handleSaveSchema}
        />
      ),
    },
    {
      id: 'uitzonderingen',
      label: 'Uitzonderingen',
      content: (
        <ExceptionalDays
          exceptionalDays={exceptionalDays}
          setExceptionalDays={setExceptionalDays}
          onSaveExceptionalDays={handleSaveExceptionalDays}
        />
      ),
    },
    {
      id: 'instellingen',
      label: 'Instellingen',
      content: <Settings />,
    },
  ];

  return (
    <ModalWithTabs
      tabs={tabs}
      onClose={onClose}
    />
  );
};

export default Modal;
