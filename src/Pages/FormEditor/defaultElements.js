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

// Only one default Canvas Item: Email
export const defaultCanvasItems = [
  {
    id: 'default-email-email', // Ensure the ID starts with 'default-'
    type: 'email',
    label: 'Email',
    placeholder: 'Uw Email',
    required: true,
  },
];
