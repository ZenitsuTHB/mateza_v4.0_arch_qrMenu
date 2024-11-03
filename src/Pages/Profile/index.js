// src/components/Profile/Profile.jsx

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header';
import ProfileImage from './ProfileImage';
import ProfileBio from './ProfileBio';
import AccountManage from './AccountManage';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { avatarMapping, defaultAvatar } from './Hooks/avatarMapping';
import './css/style.css';

const Profile = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch account data once
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const data = await api.get(window.baseDomain + '/api/account');
        setAccountData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        triggerNotification('Fout bij het ophalen van accountgegevens', 'error');
      }
    };

    fetchAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler to update account data after mutations
  const updateAccountData = (updatedData) => {
    setAccountData(updatedData);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <NotificationComponent />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <NotificationComponent />
          <p>Geen accountgegevens beschikbaar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <NotificationComponent />
        
        <ProfileImage
          profileImage={accountData.imageId ? accountData.avatarMapping[accountData.imageId] : defaultAvatar}
          avatarMapping={accountData.avatarMapping}
          imageId={accountData.imageId}
          api={api}
          updateAccountData={updateAccountData}
        />

        <ProfileBio
          name={`${accountData.voornaam} ${accountData.achternaam}`}
          bio={accountData.bio}
          interests={accountData.interests || []}
          api={api}
          updateAccountData={updateAccountData}
        />

        <AccountManage
          accountData={accountData}
          setAccountData={setAccountData}
          api={api}
        />
      </div>
    </div>
  );
};

export default withHeader(Profile);
