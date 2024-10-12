// src/Pages/FormEditor/LaunchPage/index.js

import React, { useState } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/LaunchPage/launchPage.css';
import { FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';

const LaunchPage = () => {
  const [activeTab, setActiveTab] = useState('embedCode'); // Default to 'embedCode' tab

  const reservationLink = 'https://uwwebsite.com/reservering'; // Vervang door uw eigen link

  const shareMessage = 'Bekijk onze reserveringspagina!';

  // Volledige boodschap voor e-mail
  const emailSubject = 'Uitnodiging voor Reservering';
  const emailBody = `${shareMessage} ${reservationLink}`;

  // Voorbeeld van insluitcode
  const embedCode = `<iframe src="${reservationLink}" width="600" height="800" frameborder="0"></iframe>`;

  return (
    <div className="launch-page">
      {/* Succesbericht */}
      <div className="success-message">
        <FaCheckCircle className="success-icon" />
        <p>Uw pagina is klaar om te delen!</p>
      </div>

      <div className="launch-page-form">
        {/* Titel */}
        <h2 className="secondary-title">Uw Reserveringspagina</h2>

        {/* Link Sectie */}
        <div className="link-section">
          <label htmlFor="reservationLink">Reservatielink:</label>
          <div className="link-input-container">
            <input
              type="text"
              id="reservationLink"
              value={reservationLink}
              readOnly
            />
            <a href={reservationLink} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt className="link-icon" />
            </a>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="tab-menu">
          <button
            className={activeTab === 'embedCode' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('embedCode')}
          >
            Insluitcode
          </button>
          <button
            className={activeTab === 'emailSample' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('emailSample')}
          >
            E-mailvoorbeeld
          </button>
        </div>

        {/* Inhoud op basis van actieve tab */}
        {activeTab === 'embedCode' && (
          <>
            <div className="embed-section">
              <p>
                Kopieer en plak de onderstaande code om de reserveringspagina op
                uw website in te sluiten:
              </p>
              <div className="code-container">
                <pre>
                  <code>{embedCode}</code>
                </pre>
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode);
                    alert('Code gekopieerd naar klembord!');
                  }}
                >
                  Kopiëren
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'emailSample' && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default withHeader(LaunchPage);
