// src/components/GiftCard/ValidationPopup/index.js

import React from 'react';
import './css/validationPopup.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ValidationPopup = ({
  giftCardData,
  onClose,
  deductValue,
  setDeductValue,
  deductError,
  handleDeduct,
}) => {
  return (
    <div className="validation-popup__container">
      <div className="validation-popup__header">
        <h3>Cadeaubon Details</h3>
        <span className="validation-popup__date">
          Aangemaakt op: {giftCardData.reservationDate}
        </span>
      </div>
      <div className="validation-popup__info">
        <div className="validation-popup__labels">
          <p>Status:</p>
          <p>Initieel Bedrag:</p>
          <p>Beschikbaar Saldo:</p>
          <p>Vervaldatum:</p>
          <p>Geldig voor maanden:</p>
        </div>
        <div className="validation-popup__values">
          <p>{giftCardData.status}</p>
          <p>{giftCardData.initialValue}</p>
          <p>€{giftCardData.availableBalance}</p>
          <p>{giftCardData.expirationDate}</p>
          <p>{giftCardData.monthsValid} maanden</p>
        </div>
      </div>
      <div className="validation-popup__deduct">
        <label htmlFor="deduct">Bedrag om af te schrijven:</label>
        <input
          type="number"
          id="deduct"
          value={deductValue}
          onChange={(e) => setDeductValue(e.target.value)}
          placeholder="Voer bedrag in"
        />
        {deductError && (
          <p className="validation-popup__deduct-error">
            <FaTimesCircle /> {deductError}
          </p>
        )}
      </div>
      <button
        className="button-style-3"
        onClick={handleDeduct}
      >
        Valideer Cadeaubon
      </button>
    </div>
  );
};

export default ValidationPopup;
