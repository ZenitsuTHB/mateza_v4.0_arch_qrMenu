import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Star = ({ starred, toggleStar }) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    toggleStar();
    setAnimate(true);

    // Remove the rainbow animation after it finishes (1 second)
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  };

  return (
    <span onClick={handleClick} className="clickableStar">
      <FaStar
        className={`star ${starred ? 'filledStar' : 'outlinedStar'} ${animate ? 'rainbowStar' : ''}`}
      />
    </span>
  );
};

export { Star };
