import React from 'react';
import AvatarSelection from './AvatarSelection';
import useNotification from '../../Components/Notification/index';
import './css/style.css';

const AccountManagement = () => {
	const { triggerNotification, NotificationComponent} = useNotification();

  const handleAvatarSelect = (avatarIndex) => {
    console.log(`Selected Avatar Index: ${avatarIndex}`);
	triggerNotification("Avatar geselecteerd")
  };

  return (
    <div>
		<NotificationComponent/>
        <AvatarSelection onSelectAvatar={handleAvatarSelect} />

    </div>
  );
};

export default AccountManagement;