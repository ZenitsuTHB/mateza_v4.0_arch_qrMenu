// src/components/Profile/Profile.jsx

import React from 'react';
import { withHeader } from '../../Components/Structural/Header';
import ProfileImage from './ProfileImage';
import ProfileBio from './ProfileBio';
import AccountManage from './AccountManage'; // Import the new component
import useProfile from './Hooks/useProfile';
import './css/style.css';

const Profile = (props) => {
  const { profileImage, bio, name, interests, handleAvatarSelect } = useProfile();

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <ProfileImage
          profileImage={profileImage}
          onAvatarSelect={handleAvatarSelect}
        />
        
        <ProfileBio name={name} bio={bio} interests={interests} />
        <AccountManage /> {/* Add the new component here */}

      </div>
    </div>
  );
};

export default withHeader(Profile);
