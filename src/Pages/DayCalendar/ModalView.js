// src/components/Modal/Modal.jsx

import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import TimeInput from './TimeInput';
import NumberInput from './NumberInput';
import ToggleSwitch from './ToggleSwitch';
import OptionSelect from './OptionSelect';
import ShiftList from './ShiftList';
import TableSettings from './TableSettings';
import ExperienceSelector from './ExperienceSelector';
import ColorPicker from './ColorPicker';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock }) => {
  const [title, setTitle] = useState(existingBlock ? existingBlock.title : '');
  const [color, setColor] = useState(existingBlock ? existingBlock.color : '#ff0000');
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:59');
  const [zitplaatsen, setZitplaatsen] = useState(existingBlock ? existingBlock.zitplaatsen : 0);
  const [toewijzingsmanier, setToewijzingsmanier] = useState(existingBlock ? existingBlock.toewijzingsmanier : 'Indeling per tijdslot');
  const [duurtijdReservatie, setDuurtijdReservatie] = useState(existingBlock ? existingBlock.duurtijdReservatie : 0);
  const [shifts, setShifts] = useState(existingBlock ? existingBlock.shifts : []);
  const [werkenMetTafels, setWerkenMetTafels] = useState(existingBlock ? existingBlock.werkenMetTafels : false);
  const [tafels, setTafels] = useState(existingBlock ? existingBlock.tafels : []);
  const [manierVanTellen, setManierVanTellen] = useState(existingBlock ? existingBlock.manierVanTellen : 'Max. aantal gasten');
  const [lengteTijdsblok, setLengteTijdsblok] = useState(existingBlock ? existingBlock.lengteTijdsblok : 0);
  const [minOpVoorhandReserveren, setMinOpVoorhandReserveren] = useState(existingBlock ? existingBlock.minOpVoorhandReserveren : 0);
  const [wachtlijstTonen, setWachtlijstTonen] = useState(existingBlock ? existingBlock.wachtlijstTonen : false);
  const [maxCapaciteitWachtlijst, setMaxCapaciteitWachtlijst] = useState(existingBlock ? existingBlock.maxCapaciteitWachtlijst : 0);
  const [experiences, setExperiences] = useState(existingBlock ? existingBlock.experiences : []);

  useEffect(() => {
    if (toewijzingsmanier === 'Indeling per tijdslot') {
      setShifts([]);
    }
  }, [toewijzingsmanier]);

  useEffect(() => {
    if (!werkenMetTafels) {
      setTafels([]);
    }
  }, [werkenMetTafels]);

  useEffect(() => {
    if (!wachtlijstTonen) {
      setMaxCapaciteitWachtlijst(0);
    }
  }, [wachtlijstTonen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      title,
      color,
      startTime,
      endTime,
      zitplaatsen,
      toewijzingsmanier,
      duurtijdReservatie,
      shifts,
      werkenMetTafels,
      tafels,
      manierVanTellen,
      lengteTijdsblok,
      minOpVoorhandReserveren,
      wachtlijstTonen,
      maxCapaciteitWachtlijst,
      experiences,
    };

    onSave(newBlock);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{existingBlock ? 'Blok Bewerken' : 'Blok Toevoegen'}</h2>
        <form onSubmit={handleSubmit}>
          <TextInput label="Titel" value={title} onChange={setTitle} />
          <ColorPicker label="Kleur instelling" value={color} onChange={setColor} />
          <TimeInput label="Start tijd" value={startTime} onChange={setStartTime} />
          <TimeInput label="Eindtijd" value={endTime} onChange={setEndTime} />
          <NumberInput label="Zitplaatsen" value={zitplaatsen} onChange={setZitplaatsen} min={0} />
          <OptionSelect
            label="Toewijzingsmanier"
            options={[
              'Indeling per tijdslot',
              'Reservaties per shift',
              'Vrij reserveren per shift',
            ]}
            value={toewijzingsmanier}
            onChange={setToewijzingsmanier}
          />
          {toewijzingsmanier === 'Indeling per tijdslot' && (
            <NumberInput
              label="Duurtijd reservatie (min)"
              value={duurtijdReservatie}
              onChange={setDuurtijdReservatie}
              min={0}
              step={5}
            />
          )}
          {(toewijzingsmanier === 'Reservaties per shift' || toewijzingsmanier === 'Vrij reserveren per shift') && (
            <ShiftList
              shifts={shifts}
              setShifts={setShifts}
              startTime={startTime}
              endTime={endTime}
            />
          )}
          <ToggleSwitch label="Werken met tafels" value={werkenMetTafels} onChange={setWerkenMetTafels} alignLeft />
          <TableSettings tafels={tafels} setTafels={setTafels} show={werkenMetTafels} />
          <OptionSelect
            label="Manier van tellen"
            options={[
              'Max. aantal tafels',
              'Max. aantal gasten',
              'Max. tafelcapaciteit',
            ]}
            value={manierVanTellen}
            onChange={setManierVanTellen}
          />
          <NumberInput
            label="Lengte van tijdsblok (min)"
            value={lengteTijdsblok}
            onChange={setLengteTijdsblok}
            min={0}
            step={5}
          />
          <NumberInput
            label="Min. op voorhand reserveren (min)"
            value={minOpVoorhandReserveren}
            onChange={setMinOpVoorhandReserveren}
            min={0}
            step={5}
          />
          <ToggleSwitch label="Wachtlijst tonen wanneer volzet" value={wachtlijstTonen} onChange={setWachtlijstTonen} alignLeft />
          {wachtlijstTonen && (
            <NumberInput
              label="Max. capaciteit wachtlijst"
              value={maxCapaciteitWachtlijst}
              onChange={setMaxCapaciteitWachtlijst}
              min={0}
            />
          )}
          <ExperienceSelector experiences={experiences} setExperiences={setExperiences} />
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
