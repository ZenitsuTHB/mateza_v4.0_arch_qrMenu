import React, { useState } from 'react';
import ModalWithoutTabs from '../../Components/Structural/Modal/Standard'; // Adjust the path as necessary
import './css/menu.css';
import { FaInfoCircle } from 'react-icons/fa';

const EditMenuModal = ({ isVisible, menu, api, triggerNotification, refreshMenus, onClose }) => {
  const [formData, setFormData] = useState({
    name: menu.name || '',
    startDate: menu.startDate || '',
    endDate: menu.endDate || '',
    startHour: menu.startHour || '',
    endHour: menu.endHour || '',
    daysOfWeek: menu.daysOfWeek || [],
  });

  // State for errors
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const day = value;
      setFormData((prevFormData) => {
        let daysOfWeek = [...prevFormData.daysOfWeek];
        if (checked) {
          daysOfWeek.push(day);
        } else {
          daysOfWeek = daysOfWeek.filter((d) => d !== day);
        }
        return { ...prevFormData, daysOfWeek };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Menu naam is verplicht.';
    }
    if (!formData.startDate) {
      validationErrors.startDate = 'Startdatum is verplicht.';
    }
    if (!formData.endDate) {
      validationErrors.endDate = 'Einddatum is verplicht.';
    }
    if (!formData.startHour) {
      validationErrors.startHour = 'Startuur is verplicht.';
    }
    if (!formData.endHour) {
      validationErrors.endHour = 'Einduur is verplicht.';
    }
    if (formData.daysOfWeek.length === 0) {
      validationErrors.daysOfWeek = 'Selecteer minstens één dag.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // PUT data to api/menu/:id
      try {
        const response = await api.put(`${window.baseDomain}api/menu/${menu._id}`, formData);
        if (response) {
          // Success
          triggerNotification('Menu succesvol bijgewerkt', 'success');
          refreshMenus();
          onClose();
        } else {
          setErrors({ server: 'Er is een fout opgetreden bij het bijwerken van het menu.' });
        }
      } catch (error) {
        console.error('Error updating menu:', error);
        setErrors({ server: 'Er is een fout opgetreden bij het bijwerken van het menu.' });
        triggerNotification('Fout bij het bijwerken van het menu', 'error');
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <ModalWithoutTabs
      onClose={onClose}
      content={
        <div className="menu-component__edit-modal">
          <h3>Menu Bewerken</h3>
          <form className="menu-component__form" onSubmit={handleSubmit}>
            {/* Menu Naam */}
            <div className="menu-component__form-group">
              <div className="label-with-tooltip">
                <label>Menu Naam</label>
                <div className="button-with-tooltip">
                  <FaInfoCircle />
                  <div className="tooltip">
                    De naam van het menu.
                  </div>
                </div>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="menu-component__error">{errors.name}</p>}
            </div>

            {/* Other form fields with tooltips (similar to MenuForm) */}

            {/* ... (include other form fields with tooltips) */}

            <button type="submit" className="menu-component__submit-button">
              Menu Bijwerken
            </button>
            {errors.server && <p className="menu-component__error">{errors.server}</p>}
          </form>
        </div>
      }
    />
  );
};

export default EditMenuModal;
