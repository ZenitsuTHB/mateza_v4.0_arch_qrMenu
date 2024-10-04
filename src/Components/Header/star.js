import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const Star = ({ starred, toggleStar, showTooltip }) => {
  const [animate, setAnimate] = useState(false);
  const [hideStar, setHideStar] = useState(false);

  useEffect(() => {
    if (!starred) {
      // Hide the star after 2 seconds if not hovered
      const timer = setTimeout(() => {
        setHideStar(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setHideStar(false);
    }
  }, [starred]);

  const handleClick = () => {
    toggleStar();
    setAnimate(true);

    // Remove the rainbow animation after it finishes (1 second)
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  };

  return (
    <span 
      onClick={handleClick} 
      className={`clickableStar ${hideStar ? 'hideAfterDelay' : ''}`} 
      style={{ position: 'relative' }}
    >
      <FaStar
        className={`star ${starred ? 'filledStar' : 'outlinedStar'} ${animate ? 'rainbowStar' : ''}`}
      />
      {showTooltip && (
        <span className="tooltip tooltipFadeUp">Toegevoegd aan Favorieten</span>
      )}
    </span>
  );
};

export { Star };