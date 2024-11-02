// src/components/GiftCard/ValidationSection/index.js

import React, { useState } from 'react';
import ModalWithoutTabs from '../../../Components/Structural/Modal/Standard'; // Adjusted import path
import './css/validationSection.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ValidationPopup from './ValidationPopup'; // Import the ValidationPopup component

const ValidationSection = () => {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(null); // null: no attempt, true: valid, false: invalid
  const [showPopup, setShowPopup] = useState(false);
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
      setShowPopup(true);
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
    // For demonstration, we'll just close the popup
    setDeductError('');
    setShowPopup(false);
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

      {showPopup && (
        <ModalWithoutTabs
          onClose={() => setShowPopup(false)}
          content={
            <ValidationPopup
              giftCardData={giftCardData}
              onClose={() => setShowPopup(false)}
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

export default ValidationSection;
