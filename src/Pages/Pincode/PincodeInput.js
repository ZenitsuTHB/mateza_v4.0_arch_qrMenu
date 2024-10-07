// src/components/PincodeScreen/PincodeInput.jsx

import React, { useState, useRef } from 'react';
import './css/pincodeInput.css';

const PincodeInput = ({ length }) => {
  // Initialize state with value and masked flag for each digit
  const [digits, setDigits] = useState(
    Array.from({ length }, () => ({ value: '', masked: false }))
  );

  // Refs to store timeout IDs for each digit
  const timeoutRefs = useRef(Array(length).fill(null));

  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const { value } = e.target;

    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index].value = value;
    newDigits[index].masked = false;
    setDigits(newDigits);

    // Clear any existing timeout for this digit
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    // Set timeout to mask the digit after 0.5 seconds
    timeoutRefs.current[index] = setTimeout(() => {
      const updatedDigits = [...digits];
      updatedDigits[index].masked = true;
      setDigits(updatedDigits);
      timeoutRefs.current[index] = null;
    }, 500);

    // Move focus to next input if not the last
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (digits[index].value === '' && index > 0) {
        // Clear the previous digit and focus it
        newDigits[index - 1].value = '';
        newDigits[index - 1].masked = false;
        setDigits(newDigits);
        inputRefs.current[index - 1].focus();

        // Clear any existing timeout for the previous digit
        if (timeoutRefs.current[index - 1]) {
          clearTimeout(timeoutRefs.current[index - 1]);
          timeoutRefs.current[index - 1] = null;
        }
      } else {
        // Clear the current digit
        newDigits[index].value = '';
        newDigits[index].masked = false;
        setDigits(newDigits);

        // Clear any existing timeout for the current digit
        if (timeoutRefs.current[index]) {
          clearTimeout(timeoutRefs.current[index]);
          timeoutRefs.current[index] = null;
        }
      }
    }
  };

  const handleFocus = (index) => {
    if (digits[index].masked) {
      const newDigits = [...digits];
      newDigits[index].masked = false;
      setDigits(newDigits);
    }
  };

  return (
    <div className="pincode-input-container">
      {digits.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength="1"
          className="pincode-input"
          value={digit.masked ? '•' : digit.value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default PincodeInput;
