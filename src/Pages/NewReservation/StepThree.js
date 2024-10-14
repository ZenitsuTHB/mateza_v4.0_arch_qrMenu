// src/components/NewReservation/SuccessMessage.jsx
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { fields } from './formConfig'; // Adjust the import path as necessary
import './css/successPage.css';

const SuccessMessage = () => {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('summary');
    if (data) {
      setSummaryData(JSON.parse(data));
    }
  }, []);

  return (
    <div className="reservation-form">
      <div className="success-message">
        <FaCheckCircle className="success-icon" />
        <p>Uw reservatie werd succesvol aangemaakt.</p>
      </div>

      {summaryData && (
        <div className="reservation-summary">
          <h2>Reserveringsoverzicht</h2>
          <ul>
            {fields.map((field) => (
              <li key={field.id}>
                <strong>{field.label}:</strong> {summaryData[field.id]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuccessMessage;
