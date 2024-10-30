// src/components/Modal/index.js

import React, { useState, useEffect } from 'react';
import ModalWithTabs from './ModalWithTabs';
import ModalContent from './ModalContent';
import Scheme from './Scheme/Scheme';
import ExceptionalDays from './Exceptions/Exceptions';
import { formatDateKey } from '../Utils/dateFormat';
import './css/modalView.css';

const Modal = ({ onClose, onSave, onDelete, existingBlock, selectedDate, triggerNotification }) => {
  const [schemeSettings, setschemeSettings] = useState(
    existingBlock?.schemeSettings || {}
  );

  const [exceptionalDays, setExceptionalDays] = useState(
    existingBlock?.exceptionalDays || {
      sluitingsperiode: [],
      sluitingsdag: [],
      uitzonderlijkeOpeningsuren: [],
    }
  );

  const formatDateDutch = (date) => {
    const months = [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
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
      schemeSettings,
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
      label: 'Tijdsblok',
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
        <Scheme
          schemeSettings={schemeSettings}
          setschemeSettings={setschemeSettings}
          onSaveScheme={handleSaveSchema}
          triggerNotification={triggerNotification}
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
  ];

  return <ModalWithTabs tabs={tabs} onClose={onClose} />;
};

export default Modal;
