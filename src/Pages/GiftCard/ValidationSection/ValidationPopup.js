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
        <h3>Gift Card Details</h3>
        <span className="validation-popup__date">
          Created on: {giftCardData.reservationDate}
        </span>
      </div>
      <div className="validation-popup__info">
        <div className="validation-popup__labels">
          <p>Status:</p>
          <p>Initial Value:</p>
          <p>Available Balance:</p>
          <p>Expiration Date:</p>
          <p>Months Valid:</p>
        </div>
        <div className="validation-popup__values">
          <p>{giftCardData.status}</p>
          <p>{giftCardData.initialValue}</p>
          <p>${giftCardData.availableBalance}</p>
          <p>{giftCardData.expirationDate}</p>
          <p>{giftCardData.monthsValid} months</p>
        </div>
      </div>
      <div className="validation-popup__deduct">
        <label htmlFor="deduct">Value to Deduct:</label>
        <input
          type="number"
          id="deduct"
          value={deductValue}
          onChange={(e) => setDeductValue(e.target.value)}
          placeholder="Enter amount"
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
        Validate Gift Card!
      </button>
    </div>
  );
};

export default ValidationPopup;
