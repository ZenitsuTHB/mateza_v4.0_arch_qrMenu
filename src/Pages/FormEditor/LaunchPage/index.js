// src/Pages/FormEditor/LaunchPage/index.jsx

import React, { useState } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/LaunchPage/launchPage.css';
import { FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EmbedCodeTab from './EmbedCodeTab.js';
import EmailSampleTab from './EmailSampleTab.js';

const LaunchPage = () => {
  const [activeTab, setActiveTab] = useState('embedCode'); // Default to 'embedCode' tab

  const reservationLink = 'https://uwwebsite.com/reservering'; // Vervang door uw eigen link

  const shareMessage = 'Bekijk onze reserveringspagina!';

  // Volledige boodschap voor e-mail
  const emailSubject = 'Uitnodiging voor Reservering';
  const emailBody = `${shareMessage} ${reservationLink}`;

  // Voorbeeld van insluitcode
  const embedCode = `<iframe src="${reservationLink}" width="600" height="800" frameborder="0"></iframe>`;

  // Tabs configuration
  const tabs = [
    { id: 'embedCode', label: 'Insluitcode' },
    { id: 'emailSample', label: 'E-mailvoorbeeld' },
  ];

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
          <div className="buttons-container">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="tab-label">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="underline-launch-page" // Unique layoutId
                    className="tab-underline"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inhoud op basis van actieve tab */}
        {activeTab === 'embedCode' && (
          <EmbedCodeTab embedCode={embedCode} />
        )}

        {activeTab === 'emailSample' && (
          <EmailSampleTab
            emailSubject={emailSubject}
            emailBody={emailBody}
            shareMessage={shareMessage}
            reservationLink={reservationLink}
          />
        )}
      </div>
    </div>
  );
};

export default withHeader(LaunchPage);
