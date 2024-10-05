import React, { useState } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/avatarSelection.css'; // Import the CSS for styling

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

  const handleSelectAvatar = (index) => {
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
              className={`avatar-button ${selectedAvatar === index ? 'selected' : ''}`}
              onClick={() => handleSelectAvatar(index)}
            >
              <img src={avatar} alt={`Avatar ${index + 1}`} className="avatar-image" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelection;