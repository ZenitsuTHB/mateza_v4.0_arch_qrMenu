// Walls.js
import React from 'react';
import './css/walls.css';

const Walls = ({ length }) => {
  const wallWidth = 100 + (length - 1) * 50;
  const wallHeight = 20;

  return (
    <div
      className="walls-container"
      style={{ width: `${wallWidth}px`, height: `${wallHeight}px` }}
    >
      <div className="wall"></div>
    </div>
  );
};

export default Walls;
