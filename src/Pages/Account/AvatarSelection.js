// src/components/AvatarSelection/AvatarSelection.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../Redux/actions/avatarActions';
import { avatars, avatarNames } from './avatars'; // Importing from avatars.js
import './css/avatarSelection.css'

const AvatarSelection = ({ onSelectAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPosition, setAvatarPosition] = useState({ initialTop: 0, initialLeft: 0 });
  const [avatarTransform, setAvatarTransform] = useState({ deltaX: 0, deltaY: 0 });
  const [isReverting, setIsReverting] = useState(false);
  const [accountName, setAccountName] = useState('');
  const avatarRefs = useRef([]);
  const [titleText, setTitleText] = useState('Kies een Avatar');
  const [subtitleText, setSubtitleText] = useState('Stap 1/3');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedAvatar !== null && !isReverting) {
      setSubtitleText('Stap 2/3');
      setTitleText('Kies een Accountnaam');
    } else if (isReverting) {
      setSubtitleText('Stap 1/3');
      setTitleText('Kies een Avatar');
    }
  }, [selectedAvatar, isReverting]);

  useEffect(() => {
    const handleResize = () => {
      if (selectedAvatar !== null) {
        const avatarElement = avatarRefs.current[selectedAvatar];
        if (!avatarElement) return;

        const rect = avatarElement.getBoundingClientRect();
        const initialTop = rect.top;
        const initialLeft = rect.left;

        const avatarWidth = avatarElement.offsetWidth;
        const avatarHeight = avatarElement.offsetHeight;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const centerLeft = viewportWidth / 2 - avatarWidth / 2;
        const centerTop = viewportHeight / 2 - avatarHeight / 2;

        const deltaX = centerLeft - initialLeft;
        const deltaY = centerTop - initialTop;

        setAvatarPosition({ initialTop, initialLeft });
        setAvatarTransform({ deltaX, deltaY });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedAvatar]);

  const handleSelectAvatar = (index) => {
    if (selectedAvatar === index || isReverting) return; // Prevent re-selecting the same avatar or during revert

    const avatarElement = avatarRefs.current[index];
    if (!avatarElement) return;

    const rect = avatarElement.getBoundingClientRect();
    const initialTop = rect.top;
    const initialLeft = rect.left;

    const avatarWidth = avatarElement.offsetWidth;
    const avatarHeight = avatarElement.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const centerLeft = viewportWidth / 2 - avatarWidth / 2;
    const centerTop = viewportHeight / 2 - avatarHeight / 2;

    const deltaX = centerLeft - initialLeft;
    const deltaY = centerTop - initialTop;

    setAvatarPosition({ initialTop, initialLeft });
    setAvatarTransform({ deltaX, deltaY });
    setSelectedAvatar(index);
    onSelectAvatar(index);
  };

  const handleRevertAvatar = () => {
    if (selectedAvatar === null || isReverting) return;

    setIsReverting(true);

    // Delay the state reset to allow the revert animation to play
    setTimeout(() => {
      setSelectedAvatar(null);
      setAvatarPosition({ initialTop: 0, initialLeft: 0 });
      setAvatarTransform({ deltaX: 0, deltaY: 0 });
      setIsReverting(false);
    }, 1000); // Duration should match the CSS transition duration
  };

  const goToNextPage = () => {
    if (accountName.trim() === '') {
      alert('Please enter an account name.');
      return;
    }

    localStorage.setItem('loginSuccessful', 'true');
    dispatch(setAvatar(avatarNames[selectedAvatar]));
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="avatar-page avatar-page-container">
      <div className="avatar-title-and-selection">
        <h4 className="avatar-subtitle">{subtitleText}</h4>
        <h1 className="avatar-title">{titleText}</h1>
        <div className="avatar-selection-container">
          {avatars.map((avatar, index) => (
            <button
              key={index}
              className={`avatar-button ${
                selectedAvatar === index
                  ? isReverting
                    ? 'reverting'
                    : 'selected'
                  : selectedAvatar !== null
                  ? 'hidden'
                  : ''
              }`}
              onClick={() => handleSelectAvatar(index)}
              ref={(el) => (avatarRefs.current[index] = el)}
              style={
                selectedAvatar === index && !isReverting
                  ? {
                      position: 'fixed',
                      top: avatarPosition.initialTop,
                      left: avatarPosition.initialLeft,
                      transform: `translate(${avatarTransform.deltaX}px, ${avatarTransform.deltaY}px) scale(2)`,
                      zIndex: 10,
                      transition: 'transform 1s, top 1s, left 1s', // Ensure transitions match the revert delay
                    }
                  : {}
              }
            >
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`avatar-image ${
                  selectedAvatar === index && !isReverting ? 'miraculous' : ''
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path_to_placeholder_image'; // Replace with actual placeholder path
                }}
              />
            </button>
          ))}
          {selectedAvatar !== null && (
            <input
              type="text"
              className={`account-input ${selectedAvatar !== null ? 'visible' : ''}`}
              placeholder="Vul accountnaam in"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          )}
        </div>
        {selectedAvatar !== null && (
          <div className="button-group">
            <button
              className="previous-button visible"
              onClick={handleRevertAvatar}
              disabled={isReverting}
            >
              Vorige
            </button>
            <button
              className="next-button visible"
              onClick={goToNextPage}
              disabled={isReverting}
            >
              Volgende
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarSelection;
