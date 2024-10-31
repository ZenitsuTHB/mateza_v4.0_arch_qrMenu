// src/Pages/FormEditor/LaunchPage/index.jsx

import React, { useState } from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EmbedCodeTab from './EmbedCodeTab.js';
import EmailSampleTab from './EmailSampleTab.js';
import './css/launchPage.css';
import './css/mobile.css';

const LaunchPage = () => {
  const [activeTab, setActiveTab] = useState('embedCode');
  const reservationLink = 'http://localhost:2000/'; // Updated to local development link
  const shareMessage = 'Bekijk onze reserveringspagina!';
  const emailSubject = 'Uitnodiging voor Reservering';
  const emailBody = `${shareMessage} ${reservationLink}`;
  const embedCode = `<iframe src="${reservationLink}" width="600" height="800" frameborder="0"></iframe>`;

  const tabs = [
    { id: 'embedCode', label: 'Insluitcode' },
    { id: 'emailSample', label: 'E-mailvoorbeeld' },
  ];

  /**
   * Function to handle sending the access token to the target window
   */
  const sendAccessToken = () => {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No access token found in localStorage.');
      alert('Er is geen toegangstoken beschikbaar.');
      return;
    }

    // Open the target window
    const targetOrigin = 'http://localhost:2000'; // Target origin without trailing slash
    const newWindow = window.open(targetOrigin, '_blank');

    if (!newWindow) {
      console.error('Failed to open the target window.');
      alert('Kan het doelvenster niet openen.');
      return;
    }

    // Define a handler to send the token once the new window is ready
    const handleMessage = (event) => {
      // Verify the origin of the incoming message
      if (event.origin !== targetOrigin) {
        console.warn(`Unexpected origin: ${event.origin}`);
        return;
      }

      if (event.data === 'ready') {
        // Send the access token to the target window
        newWindow.postMessage({ token: accessToken }, targetOrigin);
        console.log('Access token sent to the target window.');

        // Remove the event listener after sending the token
        window.removeEventListener('message', handleMessage);
      }
    };

    // Add an event listener to listen for the 'ready' message from the target window
    window.addEventListener('message', handleMessage, false);
  };

  return (
    <div className="launch-page">

      <div className="launch-page-form central-container-style">
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
            <button
              onClick={sendAccessToken}
              rel="noopener noreferrer"
              className="link-icon"
            >
              <FaExternalLinkAlt />
            </button>
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
