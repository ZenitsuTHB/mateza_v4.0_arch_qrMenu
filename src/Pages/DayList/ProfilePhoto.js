// src/components/ReservationsList/ProfilePhoto.jsx

import React from 'react';
import './css/profilePhoto.css';

const ProfilePhoto = ({ initials }) => {
  const backgroundColor = getRandomColor();

  return (
    <div className="profile-photo" style={{ backgroundColor }}>
      {initials}
    </div>
  );
};

function getRandomColor() {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F0FF33', '#FF33F0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default ProfilePhoto;
