// src/components/GiftCard/ValidationSection/index.js

import React, { useState } from 'react';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard'; // Adjust the import path as needed
import './css/validationSection.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ValidationSection = () => {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(null); // null: no attempt, true: valid, false: invalid
  const [showModal, setShowModal] = useState(false);
  const [deductValue, setDeductValue] = useState('');
  const [deductError, setDeductError] = useState('');

  // Mock data for demonstration purposes
  const giftCardData = {
    status: 'Active',
    initialValue: '$100',
    availableBalance: 100,
    expirationDate: '2025-12-31',
    monthsValid: 24,
    reservationDate: '2024-04-27',
  };

  const handleValidateCode = () => {
    // Simple validation logic (for demonstration)
    if (code.trim() === 'GIFT2024') {
      setIsValid(true);
      setShowModal(true);
    } else {
      setIsValid(false);
    }
  };

  const handleDeduct = () => {
    const value = parseFloat(deductValue);
    if (isNaN(value) || value <= 0) {
      setDeductError('Please enter a valid amount.');
      return;
    }
    if (value > giftCardData.availableBalance) {
      setDeductError('Deduction exceeds available balance.');
      return;
    }
    // Proceed with deduction logic (e.g., API call)
    // For demonstration, we'll just close the modal and reset deduction state
    setDeductError('');
    setDeductValue('');
    setShowModal(false);
    alert(`$${value} has been deducted from your gift card.`);
  };

  return (
    <div className="validation-section">
      <h2 className="validation-section__title">Validate</h2>
      <p className="validation-section__description">
        Enter your gift card code here
      </p>
      <input
        type="text"
        className="validation-section__input"
        placeholder="Enter Gift Card Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="validation-section__button"
        onClick={handleValidateCode}
      >
        Validate Code
      </button>
      {isValid === false && (
        <p className="validation-section__error">
          <FaTimesCircle /> Please enter a valid code
        </p>
      )}

      {showModal && (
        <ModalWithoutTabs
          onClose={() => setShowModal(false)}
          content={
            <ValidationDetails
              giftCardData={giftCardData}
              deductValue={deductValue}
              setDeductValue={setDeductValue}
              deductError={deductError}
              handleDeduct={handleDeduct}
            />
          }
        />
      )}
    </div>
  );
};

const ValidationDetails = ({
  giftCardData,
  deductValue,
  setDeductValue,
  deductError,
  handleDeduct,
}) => {
  return (
    <div className="validation-details__container">
      <div className="validation-details__header">
        <h3>Gift Card Details</h3>
        <span className="validation-details__date">
          Created on: {giftCardData.reservationDate}
        </span>
      </div>
      <div className="validation-details__info">
        <div className="validation-details__labels">
          <p>Status:</p>
          <p>Initial Value:</p>
          <p>Available Balance:</p>
          <p>Expiration Date:</p>
          <p>Months Valid:</p>
        </div>
        <div className="validation-details__values">
          <p>{giftCardData.status}</p>
          <p>{giftCardData.initialValue}</p>
          <p>${giftCardData.availableBalance}</p>
          <p>{giftCardData.expirationDate}</p>
          <p>{giftCardData.monthsValid} months</p>
        </div>
      </div>
      <div className="validation-details__deduct">
        <label htmlFor="deduct">Value to Deduct:</label>
        <input
          type="number"
          id="deduct"
          value={deductValue}
          onChange={(e) => setDeductValue(e.target.value)}
          placeholder="Enter amount"
        />
        {deductError && (
          <p className="validation-details__deduct-error">
            <FaTimesCircle /> {deductError}
          </p>
        )}
      </div>
      <button
        className="validation-details__validate-button"
        onClick={handleDeduct}
      >
        <FaCheckCircle /> Validate Gift Card!
      </button>
    </div>
  );
};

export default ValidationSection;
