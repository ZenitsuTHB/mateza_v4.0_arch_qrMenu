// ProfilePicture.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../Redux/actions/avatarActions.js';
import './css/profilePicture.css';

// Importing avatar images
import blue1 from '../../../Assets/avatars/blue1.webp';
import blue2 from '../../../Assets/avatars/blue2.webp';
import blue3 from '../../../Assets/avatars/blue3.webp';
import red1 from '../../../Assets/avatars/red1.webp';
import red2 from '../../../Assets/avatars/red2.webp';
import red3 from '../../../Assets/avatars/red3.webp';
import green1 from '../../../Assets/avatars/green1.webp';
import green2 from '../../../Assets/avatars/green2.webp';
import green3 from '../../../Assets/avatars/green3.webp';

// Define the avatarMapping using imported images
const avatarMapping = {
  'blue1': blue1,
  'blue2': blue2,
  'blue3': blue3,
  'red1': red1,
  'red2': red2,
  'red3': red3,
  'green1': green1,
  'green2': green2,
  'green3': green3,
};

const defaultAvatar = blue1; // Set a default avatar (can be any imported image)

const ProfilePicture = () => {
  const dispatch = useDispatch();
  const profileImage = useSelector((state) => avatarMapping[state.avatar] || defaultAvatar);

  useEffect(() => {
    const selectedAvatar = localStorage.getItem('selectedAvatar');
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      dispatch(setAvatar(selectedAvatar));
    }
  }, [dispatch]);

  return (
    <div className="profile-picture-container">
      <img
        src={profileImage}
        alt="Profile"
        className="profile-pic"
      />
    </div>
  );
};

export default ProfilePicture;
