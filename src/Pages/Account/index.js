// src/components/AccountManagement.jsx

import React, { useState } from 'react';
import WelcomeAnimation from './WelcomeAnimation';
import LanguageSelection from './LanguageSelection';
import AvatarSelection from './AvatarSelection';
import useNotification from '../../Components/Notification/index';

const AccountManagement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { triggerNotification, NotificationComponent } = useNotification();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAnimationComplete = () => {
    setCurrentStep(2);
  };

  const handleLanguageSelect = (languageCode) => {
    console.log(`Selected Language Code: ${languageCode}`);
    setSelectedLanguage(languageCode);
    setCurrentStep(3);
    triggerNotification(`Taal geselecteerd: ${languageCode}`);
  };

  const handleAvatarSelect = (avatarIndex) => {
    console.log(`Selected Avatar Index: ${avatarIndex}`);
    setSelectedAvatar(avatarIndex);
    triggerNotification('Avatar geselecteerd');
    setCurrentStep(4);
  };

  return (
    <div>
      <NotificationComponent />
      {currentStep === 1 && (
        <WelcomeAnimation onComplete={handleAnimationComplete} />
      )}
      {currentStep === 2 && (
        <LanguageSelection onSelectLanguage={handleLanguageSelect} />
      )}
      {currentStep === 3 && (
        <AvatarSelection onSelectAvatar={handleAvatarSelect} />
      )}
      {currentStep === 4 && (
        <div className="completion-screen">
          <h2>Account Setup Complete!</h2>
          {/* Add any additional completion steps or redirects here */}
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
