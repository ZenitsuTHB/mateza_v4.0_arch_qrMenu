// src/Pages/FormEditor/LaunchPage/index.js

import React from 'react';
import { withHeader } from '../../../Components/Structural/Header/index.js';
import '../css/LaunchPage/launchPage.css'; // Ensure this path is correct
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';

const LaunchPage = () => {
  const reservationLink = 'https://yourwebsite.com/reservation'; // Replace with your actual link

  const shareMessage = 'Bekijk onze reserveringspagina!';

  // Complete message for platforms that require it
  const fullMessage = `${shareMessage} ${reservationLink}`;

  return (
    <div className="launch-page">
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

      <div className="share-section">
        <p>Deel deze link op sociale media:</p>
        <div className="social-icons">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              reservationLink
            )}&quote=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              reservationLink
            )}&text=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon twitter"
          >
            <FaTwitter />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              reservationLink
            )}&title=${encodeURIComponent(shareMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin"
          >
            <FaLinkedinIn />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon whatsapp"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Reservatielink'
            )}&body=${encodeURIComponent(fullMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </div>
  );
};

export default withHeader(LaunchPage);
