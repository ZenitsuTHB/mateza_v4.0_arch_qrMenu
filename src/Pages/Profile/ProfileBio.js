import React from 'react';

const ProfileBio = ({ name, bio, interests }) => {
  return (
    <div className="profile-page__bio-container">
      <h2 className="profile-page__name">{name}</h2>
      <p className="profile-page__bio">{bio}</p>
      <div className="profile-page__tags">
        {interests.map((interest, index) => (
          <span key={index} className="profile-page__tag">
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileBio;
