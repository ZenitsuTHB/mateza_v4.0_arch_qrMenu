// src/Pages/FormEditor/LaunchPage/index.jsx

import React, { useState } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import { FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EmbedCodeTab from './EmbedCodeTab.js';
import EmailSampleTab from './EmailSampleTab.js';
import '../css/LaunchPage/launchPage.css';
import '../css/LaunchPage/mobile.css';

const LaunchPage = () => {
  const [activeTab, setActiveTab] = useState('embedCode');
  const reservationLink = 'https://demo.reservaties.net';
  const shareMessage = 'Bekijk onze reserveringspagina!';
  const emailSubject = 'Uitnodiging voor Reservering';
  const emailBody = `${shareMessage} ${reservationLink}`;
  const embedCode = `<iframe src="${reservationLink}" width="600" height="800" frameborder="0"></iframe>`;

  const tabs = [
    { id: 'embedCode', label: 'Insluitcode' },
    { id: 'emailSample', label: 'E-mailvoorbeeld' },
  ];

  return (
    <div className="launch-page">
      <div className="success-message">
        <FaCheckCircle className="success-icon" />
        <p>Uw pagina is klaar om te delen!</p>
      </div>

      <div className="launch-page-form">
        <h2 className="secondary-title">Uw Reserveringspagina</h2>

        <div className="link-section">
          <label htmlFor="reservationLink">Reservatielink:</label>
          <div className="link-input-container">
            <input
              type="text"
              id="reservationLink"
              value={reservationLink}
              readOnly
            />
            <a
              href={reservationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link-icon"
            >
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>

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
                    layoutId="underline-launch-page"
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
