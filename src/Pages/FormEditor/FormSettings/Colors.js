import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../../../Components/Notification/index';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Colors = () => {
  const { triggerNotification, NotificationComponent } = useNotification();
  const [appearanceData, setAppearanceData] = useState({
    textColor: '#000000',
    backgroundColor: '',
    containerColor: '#FFFFFF',
    buttonColor: '',
    buttonTextColor: '#FFFFFF',
  });

  useEffect(() => {
    // Fetch colors settings from server
    axios.get(window.baseDomain + 'api/colors/restaurantId123')
      .then((response) => {
        if (response.data) {
          setAppearanceData(response.data);
        }
      })
      .catch((error) => console.error('Error fetching colors:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppearanceData({
      ...appearanceData,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios.put(window.baseDomain + 'api/colors/restaurantId123', appearanceData)
      .then(() => {
        triggerNotification('Kleuren aangepast', 'success');
      })
      .catch((error) => console.error('Error saving colors:', error));
  };

  return (
    <div>
       <NotificationComponent />
      <div className="form-group">
        <label htmlFor="textColor">Tekstkleur:</label>
        <input
          type="color"
          id="textColor"
          name="textColor"
          value={appearanceData.textColor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="backgroundColor">Achtergrondkleur:</label>
        <input
          type="color"
          id="backgroundColor"
          name="backgroundColor"
          value={appearanceData.backgroundColor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="containerColor">Containerkleur:</label>
        <input
          type="color"
          id="containerColor"
          name="containerColor"
          value={appearanceData.containerColor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="buttonColor">Knopkleur:</label>
        <input
          type="color"
          id="buttonColor"
          name="buttonColor"
          value={appearanceData.buttonColor}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="buttonTextColor">Knoptekstkleur:</label>
        <input
          type="color"
          id="buttonTextColor"
          name="buttonTextColor"
          value={appearanceData.buttonTextColor}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="submit-button"
        onClick={handleSave}
      >
        Opslaan
      </button>
    </div>
  );
};

export default Colors;
