import React, { useState, useEffect, useRef } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import useNotification from '../../Components/Notification/index';
import './css/style.css';

const ProfileBio = ({ name, interests }) => {
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const bioRef = useRef(null);
  const editIconId = useRef(uuidv4());
  const { triggerNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const storedBio = localStorage.getItem('profileBio');
    if (storedBio) {
      setBio(storedBio);
    } else {
      setBio(
        'John Doe is a software engineer with over 10 years of experience in full-stack development. Passionate about building scalable web applications, he specializes in JavaScript, React, and Node.js. In his free time, he enjoys contributing to open source projects and exploring new tech innovations.'
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profileBio', bio);
  }, [bio]);

  const handleInputChange = (e) => {
    if (e.target.value.length <= 1000) {
      setBio(e.target.value);
    }
  };

  const handleBioBlur = () => {
    setIsEditing(false);
    triggerNotification('Bio succesvol bewerkt', 'success');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (bioRef.current) {
      bioRef.current.focus();
    }
  };

  return (
    <div
      className="profile-page__bio-wrapper"
      onMouseEnter={() => {
        if (!isEditing) {
          const editIcon = document.getElementById(editIconId.current);
          if (editIcon) {
            editIcon.style.visibility = 'visible';
          }
        }
      }}
      onMouseLeave={() => {
        const editIcon = document.getElementById(editIconId.current);
        if (editIcon) {
          editIcon.style.visibility = 'hidden';
        }
      }}
    >
      <NotificationComponent />
      <div className="profile-page__bio-container">
        <h2 className="profile-page__name">{name}</h2>

        <div
          className="profile-page__bio-clickable"
          onClick={handleEditClick}
          aria-label="Edit bio section"
        >
          {isEditing ? (
            <textarea
              ref={bioRef}
              className="profile-page__bio"
              value={bio}
              onChange={handleInputChange}
              onBlur={handleBioBlur}
              maxLength="1000"
              aria-label="Editable bio"
              rows={5}
            />
          ) : (
            <p className="profile-page__bio">{bio}</p>
          )}

          <FaPencilAlt
            id={editIconId.current}
            className="profile-page__edit-icon"
            onClick={handleEditClick}
            aria-label="Edit bio"
          />
        </div>

        <div className="profile-page__tags">
          {interests.map((interest, index) => (
            <span key={index} className="profile-page__tag">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileBio;
