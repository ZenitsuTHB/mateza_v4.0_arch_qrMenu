// src/components/Modal/SettingsForm.jsx

import React from 'react';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import OptionSelect from './OptionSelect';
import ShiftList from './ShiftList';

const SettingsForm = ({
  title,
  setTitle,
  zitplaatsen,
  setZitplaatsen,
  toewijzingsmanier,
  setToewijzingsmanier,
  duurtijdReservatie,
  setDuurtijdReservatie,
  shifts,
  setShifts,
  manierVanTellen,
  setManierVanTellen,
  lengteTijdsblok,
  setLengteTijdsblok,
  minOpVoorhandReserveren,
  setMinOpVoorhandReserveren,
  startTime,
  endTime,
  showSaveButton,
  handleSaveSetting,
}) => {
  return (
    <>
      <TextInput label="Titel" value={title} onChange={setTitle} />
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
      {showSaveButton && (
        <button type="button" onClick={handleSaveSetting}>Opslaan Instelling</button>
      )}
    </>
  );
};

export default SettingsForm;
