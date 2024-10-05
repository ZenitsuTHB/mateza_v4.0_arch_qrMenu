import React, { useState, useRef } from 'react';
import './css/avatarSelection.css';

// Importing avatar images
import blue1 from '../../Assets/avatars/blue1.png';
import blue2 from '../../Assets/avatars/blue2.png';
import blue3 from '../../Assets/avatars/blue3.png';
import red1 from '../../Assets/avatars/red1.png';
import red2 from '../../Assets/avatars/red2.png';
import red3 from '../../Assets/avatars/red3.png';
import green1 from '../../Assets/avatars/green1.png';
import green2 from '../../Assets/avatars/green2.png';
import green3 from '../../Assets/avatars/green3.png';

const avatars = [
  blue1,
  blue2,
  blue3,
  red1,
  red2,
  red3,
  green1,
  green2,
  green3,
];

const AvatarSelection = ({ onSelectAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPosition, setAvatarPosition] = useState({ initialTop: 0, initialLeft: 0 });
  const [avatarTransform, setAvatarTransform] = useState({ deltaX: 0, deltaY: 0 });
  const avatarRefs = useRef([]);

  const handleSelectAvatar = (index) => {
    const avatarElement = avatarRefs.current[index];
    const rect = avatarElement.getBoundingClientRect();
    const initialTop = rect.top;
    const initialLeft = rect.left;

    const avatarWidth = avatarElement.offsetWidth;
    const avatarHeight = avatarElement.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const centerLeft = viewportWidth / 2 - avatarWidth / 2;
    const centerTop = viewportHeight / 2 - avatarHeight / 2;

    const deltaX = centerLeft - initialLeft;
    const deltaY = centerTop - initialTop;

    setAvatarPosition({ initialTop: initialTop, initialLeft: initialLeft });
    setAvatarTransform({ deltaX: deltaX, deltaY: deltaY });
    setSelectedAvatar(index);
    onSelectAvatar(index);
  };

  return (
    <div className="avatar-page-container">
      <div className="avatar-title-and-selection">
        <h1 className="avatar-title">Kies een Avatar</h1>
        <div className="avatar-selection-container">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              className={`avatar-button ${
                selectedAvatar === index
                  ? 'selected'
                  : selectedAvatar !== null
                  ? 'unselected'
                  : ''
              }`}
              onClick={() => handleSelectAvatar(index)}
              ref={(el) => (avatarRefs.current[index] = el)}
              style={
                selectedAvatar === index
                  ? {
                      position: 'fixed',
                      top: avatarPosition.initialTop,
                      left: avatarPosition.initialLeft,
                      animation: 'moveToCenter 1s forwards',
                      '--deltaX': `${avatarTransform.deltaX}px`,
                      '--deltaY': `${avatarTransform.deltaY}px`,
                      zIndex: 10,
                    }
                  : {}
              }
            >
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`avatar-image ${selectedAvatar === index ? 'miraculous' : ''}`}
              />
            </button>
          ))}
        </div>
        {selectedAvatar !== null && (
          <button
            className="next-button visible"
            onClick={() => console.log('Next button clicked')}
          >
            Volgende
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarSelection;
