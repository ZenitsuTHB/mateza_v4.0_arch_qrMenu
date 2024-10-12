// src/Pages/FormEditor/LaunchPage/EmailSampleTab.jsx

import React from 'react';
import '../css/LaunchPage/emailSample.css';

const EmailSampleTab = ({ emailSubject, emailBody, shareMessage, reservationLink }) => {
  return (
    <div className="email-section">
      <p>
        Gebruik de onderstaande knop om een uitnodiging per e-mail te
        versturen:
      </p>
      <a
        href={`mailto:?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`}
        className="email-button"
      >
        E-mail Versturen
      </a>
      <p className="email-sample-text">Voorbeeldtekst:</p>
      <div className="email-sample">
        <p>{shareMessage}</p>
        <p>
          Klik hier om te reserveren:{' '}
          <a href={reservationLink}>{reservationLink}</a>
        </p>
      </div>
    </div>
  );
};

export default EmailSampleTab;
