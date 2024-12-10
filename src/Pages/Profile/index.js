// src/components/Profile/Profile.jsx

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        console.log("Account Settings GET");
        const data = await api.get(`${window.baseDomain}api/account`, { noCache: true });
        setAccountData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        triggerNotification('Fout bij het ophalen van accountgegevens', 'error');
      }
    };

    fetchAccountData();
  }, []);

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

  // Derive full name
  const fullName = `${accountData.first_name} ${accountData.last_name}`.trim();

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <NotificationComponent />
        
        {/*
        <ProfileImage
          profileImage={accountData.imageId ? avatarMapping[accountData.imageId] : defaultAvatar}
          avatarMapping={accountData.avatarMapping}
          imageId={accountData.imageId}
          api={api}
          updateAccountData={updateAccountData}
        />

        <ProfileBio
          name={fullName || 'Gebruiker'}
          bio={accountData.bio}
          interests={accountData.interests || []}
          api={api}
          updateAccountData={updateAccountData}
          restaurant_name={accountData.restaurant_name}
        />*/}

        <AccountManage
          accountData={accountData}
          setAccountData={setAccountData}
          api={api}
        />
      </div>
    </div>
  );
};

export default Profile;
