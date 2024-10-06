import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import ProfileImage from './ProfileImage';
import ProfileBio from './ProfileBio';
import blue1 from '../../Assets/avatars/blue1.webp';
import blue2 from '../../Assets/avatars/blue2.webp';
import blue3 from '../../Assets/avatars/blue3.webp';
import red1 from '../../Assets/avatars/red1.webp';
import red2 from '../../Assets/avatars/red2.webp';
import red3 from '../../Assets/avatars/red3.webp';
import green1 from '../../Assets/avatars/green1.webp';
import green2 from '../../Assets/avatars/green2.webp';
import green3 from '../../Assets/avatars/green3.webp';
import './css/style.css';

const avatarMapping = {
  blue1: blue1,
  blue2: blue2,
  blue3: blue3,
  red1: red1,
  red2: red2,
  red3: red3,
  green1: green1,
  green2: green2,
  green3: green3,
};

const defaultAvatar = blue1;

const Profile = (props) => {
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [bio, setBio] = useState(
    'John Doe is a software engineer with over 10 years of experience in full-stack development. Passionate about building scalable web applications, he specializes in JavaScript, React, and Node.js. In his free time, he enjoys contributing to open source projects and exploring new tech innovations.'
  );
  const [name, setName] = useState('John Doe');
  const [interests, setInterests] = useState(['Admin Account', '3 Maanden Actief']);

  useEffect(() => {
    const selectedAvatar = localStorage.getItem('selectedAvatar');
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      setProfileImage(avatarMapping[selectedAvatar]);
    }

    const storedBio = localStorage.getItem('profileBio');
    if (storedBio) setBio(storedBio);

    const storedName = localStorage.getItem('profileName');
    if (storedName) setName(storedName);

    const storedInterests = localStorage.getItem('profileInterests');
    if (storedInterests) {
      setInterests(JSON.parse(storedInterests));
    }
  }, []);

  const handleAvatarSelect = (avatarKey) => {
    setProfileImage(avatarMapping[avatarKey]);
    localStorage.setItem('selectedAvatar', avatarKey);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <ProfileImage
          profileImage={profileImage}
          avatarMapping={avatarMapping}
          onAvatarSelect={handleAvatarSelect}
        />
        <ProfileBio name={name} bio={bio} interests={interests} />
      </div>
    </div>
  );
};

export default withHeader(Profile);
