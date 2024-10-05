import React, { useState } from 'react';
import AvatarSelection from './AvatarSelection';
import './css/avatarSelection.css';

const ParentComponent = () => {

  const handleAvatarSelect = (avatarIndex) => {
    console.log(`Selected Avatar Index: ${avatarIndex}`);
  };

  return (
    <div className="parent-component-container">
        <AvatarSelection onSelectAvatar={handleAvatarSelect} />

    </div>
  );
};

export default ParentComponent;