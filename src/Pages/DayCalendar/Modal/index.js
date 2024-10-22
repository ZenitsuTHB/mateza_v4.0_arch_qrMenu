// src/components/Modal/Modal.jsx

import React, { useState, useEffect } from 'react';
import useApi from '../../../Hooks/useApi';
import TimeInput from './TimeInput';
import ColorPicker from './ColorPicker';
import SettingsGrid from './SettingsGrid';
import SettingsForm from './SettingsForm';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock, selectedDate }) => {
  const api = useApi();

  // State variables for basic inputs
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:59');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#ff0000');

  // State variables for settings
  const [settings, setSettings] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(existingBlock ? existingBlock.setting : null);
  const [showSettingsForm, setShowSettingsForm] = useState(false);

  // State variables for setting details
  const [title, setTitle] = useState(existingBlock ? existingBlock.title : '');
  const [zitplaatsen, setZitplaatsen] = useState(existingBlock ? existingBlock.zitplaatsen : 0);
  const [toewijzingsmanier, setToewijzingsmanier] = useState(existingBlock ? existingBlock.toewijzingsmanier : 'Indeling per tijdslot');
  const [duurtijdReservatie, setDuurtijdReservatie] = useState(existingBlock ? existingBlock.duurtijdReservatie : 0);
  const [shifts, setShifts] = useState(existingBlock ? existingBlock.shifts : []);
  const [manierVanTellen, setManierVanTellen] = useState(existingBlock ? existingBlock.manierVanTellen : 'Max. aantal gasten');
  const [lengteTijdsblok, setLengteTijdsblok] = useState(existingBlock ? existingBlock.lengteTijdsblok : 0);
  const [minOpVoorhandReserveren, setMinOpVoorhandReserveren] = useState(existingBlock ? existingBlock.minOpVoorhandReserveren : 0);

  // Fetch settings from the server
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(`${window.baseDomain}api/timeblock-settings/`);
        console.log('Fetched settings:', response);
        if (Array.isArray(response)) {
          setSettings(response);
        } else {
          setSettings([]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettings([]);
      }
    };
    fetchSettings();
  }, [api]);

  useEffect(() => {
    if (toewijzingsmanier === 'Indeling per tijdslot') {
      setShifts([]);
    }
  }, [toewijzingsmanier]);

  const handleSelectSetting = (setting) => {
    setSelectedSetting(setting);
    setShowSettingsForm(false);
    // Populate fields with selected setting
    setTitle(setting.title);
    setToewijzingsmanier(setting.toewijzingsmanier);
    setDuurtijdReservatie(setting.duurtijdReservatie);
    setShifts(setting.shifts);
    setManierVanTellen(setting.manierVanTellen);
    setLengteTijdsblok(setting.lengteTijdsblok);
    setMinOpVoorhandReserveren(setting.minOpVoorhandReserveren);
    setZitplaatsen(setting.zitplaatsen);
  };

  const handleAddSetting = () => {
    setSelectedSetting(null);
    setShowSettingsForm(true);
    // Reset fields for new setting
    setTitle('');
    setToewijzingsmanier('Indeling per tijdslot');
    setDuurtijdReservatie(0);
    setShifts([]);
    setManierVanTellen('Max. aantal gasten');
    setLengteTijdsblok(0);
    setMinOpVoorhandReserveren(0);
    setZitplaatsen(0);
  };

  const handleSaveSetting = async () => {
    const newSetting = {
      title,
      toewijzingsmanier,
      duurtijdReservatie,
      shifts,
      manierVanTellen,
      lengteTijdsblok,
      minOpVoorhandReserveren,
      zitplaatsen,
    };
    try {
      await api.post(`${window.baseDomain}api/timeblock-settings/`, newSetting);
      // Refresh settings list
      const updatedSettings = await api.get(`${window.baseDomain}api/timeblock-settings/`);
      if (Array.isArray(updatedSettings)) {
        setSettings(updatedSettings);
      } else {
        setSettings([]);
      }
      setShowSettingsForm(false);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      date: selectedDate.toDateString(),
      kleurInstelling,
      startTime,
      endTime,
      // Include selected setting details
      ...(selectedSetting || {
        title,
        toewijzingsmanier,
        duurtijdReservatie,
        shifts,
        manierVanTellen,
        lengteTijdsblok,
        minOpVoorhandReserveren,
        zitplaatsen,
      }),
    };
    onSave(newBlock);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="secondary-title">{existingBlock ? 'Blok Bewerken' : 'Blok Toevoegen'}</h2>
        <form onSubmit={handleSubmit}>
          <TimeInput label="Start tijd" value={startTime} onChange={setStartTime} />
          <TimeInput label="Eindtijd" value={endTime} onChange={setEndTime} />
          <ColorPicker label="Kleur instelling" value={kleurInstelling} onChange={setKleurInstelling} />

          <h3>Kies Instelling</h3>
          <SettingsGrid settings={settings} onSelect={handleSelectSetting} />
          <button type="button" onClick={handleAddSetting}>Instellingen Toevoegen</button>

          {(selectedSetting || showSettingsForm) && (
            <SettingsForm
              title={title}
              setTitle={setTitle}
              zitplaatsen={zitplaatsen}
              setZitplaatsen={setZitplaatsen}
              toewijzingsmanier={toewijzingsmanier}
              setToewijzingsmanier={setToewijzingsmanier}
              duurtijdReservatie={duurtijdReservatie}
              setDuurtijdReservatie={setDuurtijdReservatie}
              shifts={shifts}
              setShifts={setShifts}
              manierVanTellen={manierVanTellen}
              setManierVanTellen={setManierVanTellen}
              lengteTijdsblok={lengteTijdsblok}
              setLengteTijdsblok={setLengteTijdsblok}
              minOpVoorhandReserveren={minOpVoorhandReserveren}
              setMinOpVoorhandReserveren={setMinOpVoorhandReserveren}
              startTime={startTime}
              endTime={endTime}
              showSaveButton={showSettingsForm}
              handleSaveSetting={handleSaveSetting}
            />
          )}

          <div className="modal-buttons">
            <button type="submit" className="modal-button">
              {existingBlock ? 'Opslaan' : 'Toevoegen'}
            </button>
            <button type="button" className="modal-button" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
