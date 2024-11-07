// src/components/Walls.jsx

import React from 'react';
import './css/walls.css';

const Walls = ({ length }) => {
  // Define wall dimensions based on length
  const wallWidth = 100 + (length - 1) * 50; // Example: base width 100px, +50px per additional unit
  const wallHeight = 20; // Fixed height

  return (
    <div
      className="walls-container"
      style={{ width: `${wallWidth}px`, height: `${wallHeight}px` }}
    >
      {/* Wall representation */}
      <div className="wall"></div>
    </div>
  );
};

export default Walls;
