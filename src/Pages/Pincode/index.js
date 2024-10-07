// src/components/PincodeScreen/PincodeScreen.jsx

import React from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import PincodeInput from './PincodeInput';
import './css/pincodeScreen.css';

const PincodeScreen = () => {
  return (
    <div className="pincode-page">
      <div className="pincode-screen">
        <div className="pincode-container">
		
          <PincodeInput length={6} />
          <button className="button next-button">Volgende</button>
        </div>
      </div>
    </div>
  );
};

export default withHeader(PincodeScreen);
