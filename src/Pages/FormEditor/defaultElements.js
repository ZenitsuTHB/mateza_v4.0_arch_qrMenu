// src/components/DragAndDropEditor/defaultElements.js

import React from 'react';
import {
  FaFont,
  FaEnvelope,
  FaPhone,
  FaImage,
  FaList,
  FaHeading,
  FaKeyboard,
  FaParagraph,
} from 'react-icons/fa';

// Define the initial blocks available in the palette
export const initialBlocks = [
  { id: '1', type: 'input', label: 'Invoerveld', icon: <FaKeyboard /> },
  { id: '2', type: 'select', label: 'Selectievak', icon: <FaList /> },
  { id: '3', type: 'phone', label: 'Telefoon', icon: <FaPhone /> },
  { id: '4', type: 'email', label: 'Email', icon: <FaEnvelope /> },
  { id: '5', type: 'picture', label: 'Afbeelding', icon: <FaImage /> },
  { id: '6', type: 'textarea', label: 'Tekstveld', icon: <FaFont /> },
  { id: '7', type: 'title', label: 'Titel', icon: <FaHeading /> },
  { id: '8', type: 'paragraph', label: 'Paragraaf', icon: <FaParagraph /> },
];

// Define the default items present on the canvas
export const defaultCanvasItems = [
  {
    id: `input-${Date.now()}-voornaam`,
    type: 'input',
    label: 'Voornaam',
    placeholder: 'Uw Voornaam',
    required: true,
  },
  {
    id: `input-${Date.now()}-achternaam`,
    type: 'input',
    label: 'Achternaam',
    placeholder: 'Uw Achternaam',
    required: true,
  },
  {
    id: `email-${Date.now()}-email`,
    type: 'email',
    label: 'Email',
    placeholder: 'Uw Email',
    required: true,
  },
  {
    id: `textarea-${Date.now()}-extra-info`,
    type: 'textarea',
    label: 'Extra Info / Allergenen',
    placeholder: '',
    required: true,
  },
];
