import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../Redux/actions/avatarActions';
import useNotification from '../../Components/Notification/index';

const ProfileImage = ({ profileImage, avatarMapping, onAvatarSelect }) => {
const dispatch = useDispatch();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { triggerNotification, NotificationComponent } = useNotification();

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarSelect = (avatarKey) => {
    onAvatarSelect(avatarKey);
    setShowAvatarModal(false);
	dispatch(setAvatar(avatarKey));
	triggerNotification('Profiel aangepast', 'success');
  };

  return (
    <div>
		<NotificationComponent/>
      <div
        className="profile-page__image-container"
        onClick={handleAvatarClick}
      >
        <img src={profileImage} alt="Profile" className="profile-page__image" />
      </div>

      {showAvatarModal && (
        <div className="profile-page__modal">
          <div className="profile-page__modal-content">
            <h2>Kies een Avatar</h2>
            <div className="profile-page__avatar-grid">
              {Object.keys(avatarMapping).map((key, index) => (
                <img
                  key={key}
                  src={avatarMapping[key]}
                  alt={key}
                  className="profile-page__avatar-option"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleAvatarSelect(key)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
