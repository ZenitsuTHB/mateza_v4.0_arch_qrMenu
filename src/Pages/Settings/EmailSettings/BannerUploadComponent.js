// src/Components/BannerUploadComponent.jsx

import React, { useState, useEffect, useRef } from 'react';
import useApi from '../../../Hooks/useApi.js';
import { FaImage } from 'react-icons/fa';

const BannerUploadComponent = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const restaurantId = localStorage.getItem('username');
  const bannerImageUrl =
    `https://mateza-cloud-storage.ams3.digitaloceanspaces.com/email/banner/${restaurantId}`;
  const [isDragging, setIsDragging] = useState(false);
  const api = useApi();
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if the image exists
    fetch(bannerImageUrl, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setBannerUrl(bannerImageUrl);
        } else {
          setBannerUrl('');
        }
      })
      .catch((err) => {
        console.error('Error fetching banner image:', err);
        setBannerUrl('');
      });
  }, []);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(
        `${window.baseDomain}api/upload-image`,
        formData
      );

      // After successful upload, update the bannerUrl to trigger re-render
      setBannerUrl(bannerImageUrl + '?' + new Date().getTime()); // Add timestamp to prevent caching
    } catch (error) {
      console.error('Error uploading image:', error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Failed to upload image: ${error.response.data.error}`);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="banner-upload-container">
      <style>
        {`
          .banner-upload-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            margin-bottom: 20px;
          }

          .banner-image {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 8px;
          }

          .empty-banner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px dashed gray;
            border-radius: 8px;
            padding: 40px;
            cursor: pointer;
            background-color: #f9f9f9;
          }

          .empty-banner.dragging {
            background-color: #e9e9e9;
          }

          .empty-banner p {
            margin-top: 8px;
            font-weight: bold;
          }

          .empty-banner input {
            display: none;
          }
        `}
      </style>

      {bannerUrl ? (
        <img src={bannerUrl} alt="Banner" className="banner-image" />
      ) : (
        <div
          className={`empty-banner ${isDragging ? 'dragging' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FaImage size={48} />
          <p>Sleep uw Banner Hier...</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </div>
      )}
    </div>
  );
};

export default BannerUploadComponent;
