// src/components/Modal/ExceptionalDays.jsx

import React from 'react';
import ExceptionItem from './ExceptionItems'; // Corrected import path
import './css/exceptions.css';

const ExceptionalDays = ({
  exceptionalDays,
  setExceptionalDays,
  onSaveExceptionalDays,
}) => {
  const handleToggle = (type, index) => {
    setExceptionalDays((prev) => {
      const updatedList = prev[type].map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      );
      return { ...prev, [type]: updatedList };
    });
  };

  const handleInputChange = (type, index, field, value) => {
    setExceptionalDays((prev) => {
      const updatedList = prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, [type]: updatedList };
    });
  };

  const addNewException = (type) => {
    setExceptionalDays((prev) => {
      const newException = { enabled: false };
      if (type === 'sluitingsperiode') {
        newException.startDate = '';
        newException.endDate = '';
      } else if (type === 'sluitingsdag') {
        newException.date = '';
      } else if (type === 'uitzonderlijkeOpeningsuren') {
        newException.date = '';
        newException.startTime = '';
        newException.endTime = '';
      }
      return {
        ...prev,
        [type]: [...prev[type], newException],
      };
    });
  };

  return (
    <div>
      <h2 className="secondary-title">Uitzondering</h2>

      {/* Sluitingsperiode Section */}
      <div className="exception-type-section">
        <h3>Sluitingsperiode</h3>
        {exceptionalDays.sluitingsperiode.map((item, index) => (
          <ExceptionItem
            key={index}
            type="sluitingsperiode"
            item={item}
            index={index}
            handleToggle={handleToggle}
            handleInputChange={handleInputChange}
          />
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('sluitingsperiode')}
        >
          + Voeg Sluitingsperiode Toe
        </button>
      </div>

      {/* Sluitingsdag Section */}
      <div className="exception-type-section">
        <h3>Sluitingsdag</h3>
        {exceptionalDays.sluitingsdag.map((item, index) => (
          <ExceptionItem
            key={index}
            type="sluitingsdag"
            item={item}
            index={index}
            handleToggle={handleToggle}
            handleInputChange={handleInputChange}
          />
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('sluitingsdag')}
        >
          + Voeg Sluitingsdag Toe
        </button>
      </div>

      {/* Uitzonderlijke Openingsuren Section */}
      <div className="exception-type-section">
        <h3>Uitzonderlijke Openingsuren</h3>
        {exceptionalDays.uitzonderlijkeOpeningsuren.map((item, index) => (
          <ExceptionItem
            key={index}
            type="uitzonderlijkeOpeningsuren"
            item={item}
            index={index}
            handleToggle={handleToggle}
            handleInputChange={handleInputChange}
          />
        ))}
        <button
          type="button"
          className="add-exception-button"
          onClick={() => addNewException('uitzonderlijkeOpeningsuren')}
        >
          + Voeg Uitzonderlijke Openingsuren Toe
        </button>
      </div>

      <div className="modal-buttons">
        <button
          type="button"
          className="standard-button blue"
          onClick={onSaveExceptionalDays}
        >
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default ExceptionalDays;
