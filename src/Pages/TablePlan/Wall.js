import React from 'react';
import './css/wall.css';

const Wall = ({ orientation }) => {
  return (
    <div className={`wall ${orientation}`}>
      {/* Optional: Wall labels or indicators */}
    </div>
  );
};

export default Wall;
