// src/components/AccountManagement.jsx

import React, { useState } from 'react';
import AvatarSelection from './AvatarSelection';
import LanguageSelection from './LanguageSelection';
import useNotification from '../../Components/Notification/index';

const AccountManagement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { triggerNotification, NotificationComponent } = useNotification();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (languageCode) => {
    console.log(`Selected Language Code: ${languageCode}`);
    setSelectedLanguage(languageCode);
    setCurrentStep(2);
  };

  const handleAvatarSelect = (avatarIndex) => {
    console.log(`Selected Avatar Index: ${avatarIndex}`);
    triggerNotification("Avatar geselecteerd");
  };

  return (
    <div>
      <NotificationComponent />
      {currentStep === 1 && (
        <LanguageSelection onSelectLanguage={handleLanguageSelect} />
      )}
      {currentStep === 2 && (
        <AvatarSelection onSelectAvatar={handleAvatarSelect} />
      )}
    </div>
  );
};

export default AccountManagement;
