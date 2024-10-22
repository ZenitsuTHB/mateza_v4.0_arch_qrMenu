// src/components/Modal/Modal.jsx

import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import TimeInput from './TimeInput';
import NumberInput from './NumberInput';
import OptionSelect from './OptionSelect';
import ShiftList from './ShiftList';
import ColorPicker from './ColorPicker';
import './css/modalView.css';

const Modal = ({ onClose, onSave, existingBlock, selectedDate }) => {
  const [title, setTitle] = useState(existingBlock ? existingBlock.title : '');
  const [kleurInstelling, setKleurInstelling] = useState(existingBlock ? existingBlock.kleurInstelling : '#ff0000');
  const [startTime, setStartTime] = useState(existingBlock ? existingBlock.startTime : '00:00');
  const [endTime, setEndTime] = useState(existingBlock ? existingBlock.endTime : '23:59');
  const [zitplaatsen, setZitplaatsen] = useState(existingBlock ? existingBlock.zitplaatsen : 0);
  const [toewijzingsmanier, setToewijzingsmanier] = useState(existingBlock ? existingBlock.toewijzingsmanier : 'Indeling per tijdslot');
  const [duurtijdReservatie, setDuurtijdReservatie] = useState(existingBlock ? existingBlock.duurtijdReservatie : 0);
  const [shifts, setShifts] = useState(existingBlock ? existingBlock.shifts : []);
  const [manierVanTellen, setManierVanTellen] = useState(existingBlock ? existingBlock.manierVanTellen : 'Max. aantal gasten');
  const [lengteTijdsblok, setLengteTijdsblok] = useState(existingBlock ? existingBlock.lengteTijdsblok : 0);
  const [minOpVoorhandReserveren, setMinOpVoorhandReserveren] = useState(existingBlock ? existingBlock.minOpVoorhandReserveren : 0);

  useEffect(() => {
    if (toewijzingsmanier === 'Indeling per tijdslot') {
      setShifts([]);
    }
  }, [toewijzingsmanier]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlock = {
      id: existingBlock ? existingBlock.id : Date.now(),
      date: selectedDate.toDateString(),
      title,
      kleurInstelling,
      startTime,
      endTime,
      zitplaatsen,
      toewijzingsmanier,
      duurtijdReservatie,
      shifts,
      manierVanTellen,
      lengteTijdsblok,
      minOpVoorhandReserveren,
    };

    onSave(newBlock);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='secondary-title'>{existingBlock ? 'Blok Bewerken' : 'Blok Toevoegen'}</h2>
        <form onSubmit={handleSubmit}>
          <TextInput label="Titel" value={title} onChange={setTitle} />
          <ColorPicker label="Kleur instelling" value={kleurInstelling} onChange={setKleurInstelling} />
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
          <OptionSelect
            label="Manier van tellen"
            options={[
              'Max. aantal gasten',
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
