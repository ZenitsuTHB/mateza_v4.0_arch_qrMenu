// src/pages/SchedulePage/ToggleSwitch.js

import React from 'react';
import PropTypes from 'prop-types';
import './css/toggleSwitch.css';

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="schedule-page switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider round"></span>
  </label>
);

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ToggleSwitch;
