import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import ThemeSelectorModal from '../Theme/index.js';
import useNotification from '../../../Components/Notification/index.js';
import '../css/FormSettings/formSettings.css';
import '../css/FormSettings/mobile.css';

const Settings = forwardRef((props, ref) => {
  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
  };

  const [formData, setFormData] = useState(defaultSettings);
  const [initialFormData, setInitialFormData] = useState(defaultSettings);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const { triggerNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    axios.get(window.baseDomain + 'api/settings/restaurantId123')
      .then((response) => {
        if (response.data) {
          const data = response.data;
          const newFormData = {
            pageTitle: data.pageTitle || defaultSettings.pageTitle,
            generalNotification: data.generalNotification || '',
          };
          setFormData(newFormData);
          setInitialFormData(newFormData);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        setFormData(defaultSettings);
        setInitialFormData(defaultSettings);
      });

    axios.get(window.baseDomain + 'api/theme/restaurantId123')
      .then((response) => {
        setSelectedTheme(response.data);
      })
      .catch((error) => {
        console.error('Error fetching theme:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios.put(window.baseDomain + 'api/settings/restaurantId123', formData)
      .then(() => {
        triggerNotification('Instellingen aangepast', 'success');
        setInitialFormData(formData);
      })
      .catch((error) => {
        console.error('Error saving settings:', error);
        const errorCode = error.response?.status || 'unknown';
        triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'pageTitle' && value.trim() === '') {
      setFormData((prevData) => ({
        ...prevData,
        pageTitle: 'Reserveer Nu',
      }));
    }
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  useImperativeHandle(ref, () => ({
    isDirty,
  }));

  return (
    <div>
      <NotificationComponent />
      <div className="form-group">
        <label htmlFor="pageTitle">Titel:</label>
        <input
          type="text"
          id="pageTitle"
          name="pageTitle"
          value={formData.pageTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder="Voer de paginatitel in"
        />
      </div>

      <div className="form-group">
        <label htmlFor="generalNotification">Mededeling:</label>
        <textarea
          id="generalNotification"
          name="generalNotification"
          value={formData.generalNotification}
          onChange={handleChange}
          placeholder="Voer een algemene mededeling in"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Thema:</label>
        {selectedTheme ? (
          <div
            className="theme-preview clickable"
            onClick={() => setShowThemeModal(true)}
            style={{ cursor: 'pointer' }}
            title="Klik om het thema te wijzigen"
          >
            <div className="theme-preview-content">
              <div
                className="theme-preview-left"
                style={{ backgroundColor: selectedTheme.color }}
              ></div>
              <div className="theme-preview-right">
                <img src={selectedTheme.image} alt={selectedTheme.title} />
              </div>
            </div>
            <div className="theme-preview-title">{selectedTheme.title}</div>
          </div>
        ) : (
          <p>Geen thema geselecteerd</p>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        onClick={handleSave}
      >
        Opslaan
      </button>

      {showThemeModal && (
        <ThemeSelectorModal
          onClose={() => setShowThemeModal(false)}
          onSuccess={(theme) => {
            setSelectedTheme(theme);
            triggerNotification("Thema aangepast", "success");
          }}
        />
      )}
    </div>
  );
});

export default Settings;
